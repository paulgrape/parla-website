"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@llp/types";
import { useApi } from "@/lib/api";
import { HeartBar } from "./HeartBar";
import { ProgressBar } from "./ProgressBar";
import { CompletionScreen } from "./CompletionScreen";
import {
  TranslationExercise,
  XpPop,
} from "./exercises/TranslationExercise";
import { MatchExercise } from "./exercises/MatchExercise";
import { FillBlankExercise } from "./exercises/FillBlankExercise";
import { ListeningExercise } from "./exercises/ListeningExercise";
import { Button } from "@/components/ui/button";

type LessonState =
  | { phase: "idle" }
  | ActiveLessonState
  | RevealedLessonState
  | { phase: "ready_to_complete"; totalXp: number; perfect: boolean; mistakes: number }
  | { phase: "completed"; totalXp: number; streak: number; perfect: boolean; mistakes: number }
  | { phase: "listening_skipped_empty" }
  | { phase: "failed" };

interface ActiveLessonState {
  phase: "active";
  levelIds: string[];
  currentId: string;
  remainingIds: string[];
  mistakeIds: string[];
  fixingMistakes: boolean;
  lives: number;
  xp: number;
  mistakes: number;
  earnedIds: string[];
}

interface RevealedLessonState extends Omit<ActiveLessonState, "phase"> {
  phase: "answer_revealed";
  correct: boolean;
}

type LessonAction =
  | { type: "START"; exerciseIds: string[] }
  | { type: "SUBMIT"; correct: boolean }
  | { type: "CONTINUE" }
  | { type: "MATCH_MISTAKE" }
  | { type: "MATCH_COMPLETE" }
  | { type: "SKIP_LISTENING"; listeningIds: string[]; nonListeningIds: string[] }
  | { type: "COMPLETE"; totalXp: number; streak: number; perfect: boolean; mistakes: number }
  | { type: "FAIL" };

const MAX_LIVES = 5;
const XP_PER_EXERCISE = 10;
const PERFECT_BONUS_XP = 20;
const LISTENING_SKIP_MINUTES = 15;
const LISTENING_SKIP_STORAGE_KEY = "llp:listeningSkipUntil";

function addUnique(items: string[], item: string) {
  return items.includes(item) ? items : [...items, item];
}

function removeItems(items: string[], itemsToRemove: string[]) {
  return items.filter((item) => !itemsToRemove.includes(item));
}

function removeCurrentMistakeIfFixed(state: ActiveLessonState, correct: boolean) {
  if (!correct || !state.fixingMistakes) return state.mistakeIds;
  return state.mistakeIds.filter((id) => id !== state.currentId);
}

function awardXpOnce(state: ActiveLessonState, correct: boolean) {
  if (!correct || state.earnedIds.includes(state.currentId)) {
    return { xp: state.xp, earnedIds: state.earnedIds };
  }

  return {
    xp: state.xp + XP_PER_EXERCISE,
    earnedIds: [...state.earnedIds, state.currentId],
  };
}

function readyToComplete(state: Pick<ActiveLessonState, "xp" | "mistakes">): LessonState {
  const perfect = state.mistakes === 0;
  return {
    phase: "ready_to_complete",
    totalXp: state.xp + (perfect ? PERFECT_BONUS_XP : 0),
    perfect,
    mistakes: state.mistakes,
  };
}

function advanceLesson(state: ActiveLessonState): LessonState {
  const [nextId, ...remainingIds] = state.remainingIds;
  if (nextId) {
    return {
      ...state,
      phase: "active",
      currentId: nextId,
      remainingIds,
      fixingMistakes: false,
    };
  }

  const [mistakeId] = state.mistakeIds;
  if (mistakeId) {
    return {
      ...state,
      phase: "active",
      currentId: mistakeId,
      remainingIds: [],
      fixingMistakes: true,
    };
  }

  return readyToComplete(state);
}

function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "START": {
      const [currentId, ...remainingIds] = action.exerciseIds;
      if (!currentId) return { phase: "listening_skipped_empty" };

      return {
        phase: "active",
        levelIds: action.exerciseIds,
        currentId,
        remainingIds,
        mistakeIds: [],
        fixingMistakes: false,
        lives: MAX_LIVES,
        xp: 0,
        mistakes: 0,
        earnedIds: [],
      };
    }

    case "SUBMIT": {
      if (state.phase !== "active") return state;
      const { xp, earnedIds } = awardXpOnce(state, action.correct);
      const lives = action.correct ? state.lives : state.lives - 1;
      const mistakes = action.correct ? state.mistakes : state.mistakes + 1;
      const mistakeIds = action.correct
        ? removeCurrentMistakeIfFixed(state, true)
        : addUnique(state.mistakeIds, state.currentId);

      if (lives <= 0) return { phase: "failed" };

      return {
        phase: "answer_revealed",
        levelIds: state.levelIds,
        currentId: state.currentId,
        remainingIds: state.remainingIds,
        mistakeIds,
        fixingMistakes: state.fixingMistakes,
        lives,
        xp,
        mistakes,
        earnedIds,
        correct: action.correct,
      };
    }

    case "MATCH_MISTAKE": {
      if (state.phase !== "active") return state;
      const lives = state.lives - 1;

      if (lives <= 0) return { phase: "failed" };

      return {
        ...state,
        lives,
        mistakes: state.mistakes + 1,
        mistakeIds: addUnique(state.mistakeIds, state.currentId),
      };
    }

    case "MATCH_COMPLETE": {
      if (state.phase !== "active") return state;
      const { xp, earnedIds } = awardXpOnce(state, true);
      const nextState: ActiveLessonState = {
        ...state,
        xp,
        earnedIds,
        mistakeIds: removeCurrentMistakeIfFixed(state, true),
      };

      return advanceLesson(nextState);
    }

    case "CONTINUE": {
      if (state.phase !== "answer_revealed") return state;
      return advanceLesson({
        phase: "active",
        levelIds: state.levelIds,
        currentId: state.currentId,
        remainingIds: state.remainingIds,
        mistakeIds: state.mistakeIds,
        fixingMistakes: state.fixingMistakes,
        lives: state.lives,
        xp: state.xp,
        mistakes: state.mistakes,
        earnedIds: state.earnedIds,
      });
    }

    case "SKIP_LISTENING": {
      if (state.phase !== "active" && state.phase !== "answer_revealed") return state;

      const remainingIds = removeItems(state.remainingIds, action.listeningIds);
      const mistakeIds = removeItems(state.mistakeIds, action.listeningIds);
      const levelIds = removeItems(state.levelIds, action.listeningIds);
      const currentWasSkipped = action.listeningIds.includes(state.currentId);
      const allLevelExercisesAreListening = action.nonListeningIds.length === 0;

      if (!currentWasSkipped) {
        return {
          ...state,
          levelIds,
          remainingIds,
          mistakeIds,
        };
      }

      if (allLevelExercisesAreListening && state.earnedIds.length === 0) {
        return { phase: "listening_skipped_empty" };
      }

      return advanceLesson({
        phase: "active",
        levelIds,
        currentId: state.currentId,
        remainingIds,
        mistakeIds,
        fixingMistakes: state.fixingMistakes,
        lives: state.lives,
        xp: state.xp,
        mistakes: state.mistakes,
        earnedIds: state.earnedIds,
      });
    }

    case "COMPLETE":
      return {
        phase: "completed",
        totalXp: action.totalXp,
        streak: action.streak,
        perfect: action.perfect,
        mistakes: action.mistakes,
      };

    case "FAIL":
      return { phase: "failed" };

    default:
      return state;
  }
}

interface LessonEngineProps {
  lessonId: string;
  exercises: Exercise[];
}

export function LessonEngine({ lessonId, exercises }: LessonEngineProps) {
  const router = useRouter();
  const { fetchApi } = useApi();
  const [state, dispatch] = useReducer(lessonReducer, { phase: "idle" });
  const [selected, setSelected] = useState<string | null>(null);
  const [showXpPop, setShowXpPop] = useState(false);
  const [listeningSkipUntil, setListeningSkipUntil] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = window.localStorage.getItem(LISTENING_SKIP_STORAGE_KEY);
    const skipUntil = stored ? Number(stored) : null;
    if (skipUntil && Number.isFinite(skipUntil) && skipUntil > Date.now()) {
      return skipUntil;
    }

    window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY);
    return null;
  });
  const [now, setNow] = useState(() => Date.now());
  const completionPostingRef = useRef(false);

  const listeningSkipActive = listeningSkipUntil !== null && listeningSkipUntil > now;
  const listeningRemainingMinutes = listeningSkipActive
    ? Math.max(1, Math.ceil((listeningSkipUntil - now) / 60000))
    : 0;

  const levelExercises = useMemo(
    () => exercises.filter((exercise) => !listeningSkipActive || exercise.type !== "listening"),
    [exercises, listeningSkipActive]
  );

  const levelExerciseIds = useMemo(
    () => levelExercises.map((exercise) => exercise.id),
    [levelExercises]
  );

  const exercisesById = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise])),
    [exercises]
  );

  useEffect(() => {
    if (!listeningSkipUntil) return;

    const interval = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (listeningSkipUntil <= currentTime) {
        setListeningSkipUntil(null);
        window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY);
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [listeningSkipUntil]);

  const currentExercise =
    state.phase === "active" || state.phase === "answer_revealed"
      ? exercisesById.get(state.currentId) ?? null
      : null;

  useEffect(() => {
    if (state.phase !== "ready_to_complete" || completionPostingRef.current) return;

    completionPostingRef.current = true;
    fetchApi<{ xpEarned: number; newStreak: number; totalXp: number }>(
      "/progress",
      {
        method: "POST",
        body: JSON.stringify({ lessonId, xpEarned: state.totalXp }),
      }
    )
      .then((result) => {
        dispatch({
          type: "COMPLETE",
          totalXp: state.totalXp,
          streak: result.newStreak,
          perfect: state.perfect,
          mistakes: state.mistakes,
        });
      })
      .catch(() => {
        dispatch({
          type: "COMPLETE",
          totalXp: state.totalXp,
          streak: 0,
          perfect: state.perfect,
          mistakes: state.mistakes,
        });
      });
  }, [fetchApi, lessonId, state]);

  const goToDashboard = () => {
    router.push("/dashboard");
    router.refresh();
  };

  const handleSubmit = (correct: boolean) => {
    if (correct) {
      setShowXpPop(true);
      setTimeout(() => setShowXpPop(false), 1000);
    }
    dispatch({ type: "SUBMIT", correct });
  };

  const handleContinue = () => {
    if (state.phase !== "answer_revealed") return;

    setSelected(null);
    dispatch({ type: "CONTINUE" });
  };

  const handleMatchMistake = () => {
    if (state.phase !== "active") return;
    dispatch({ type: "MATCH_MISTAKE" });
  };

  const handleMatchComplete = () => {
    if (state.phase !== "active") return;

    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1000);
    dispatch({ type: "MATCH_COMPLETE" });
  };

  const handleStart = () => {
    completionPostingRef.current = false;
    dispatch({ type: "START", exerciseIds: levelExerciseIds });
  };

  const handleSkipListening = () => {
    const skipUntil = Date.now() + LISTENING_SKIP_MINUTES * 60 * 1000;
    window.localStorage.setItem(LISTENING_SKIP_STORAGE_KEY, String(skipUntil));
    setListeningSkipUntil(skipUntil);
    setNow(Date.now());
    setSelected(null);
    dispatch({
      type: "SKIP_LISTENING",
      listeningIds: exercises
        .filter((exercise) => exercise.type === "listening")
        .map((exercise) => exercise.id),
      nonListeningIds: exercises
        .filter((exercise) => exercise.type !== "listening")
        .map((exercise) => exercise.id),
    });
  };

  const handleResumeListening = () => {
    window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY);
    setListeningSkipUntil(null);
    setNow(Date.now());
  };

  if (state.phase === "idle") {
    const allExercisesSkipped = levelExercises.length === 0 && exercises.length > 0;

    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h2 className="text-2xl font-black">Ready for this level?</h2>
        {listeningSkipActive && (
          <div className="max-w-md rounded-2xl border-2 border-border bg-muted px-4 py-3 text-center text-sm font-bold text-muted-foreground">
            Listening is skipped for {listeningRemainingMinutes} more min.
            <Button
              className="mt-3"
              variant="outline"
              size="sm"
              onClick={handleResumeListening}
            >
              Resume listening
            </Button>
          </div>
        )}
        <p className="text-muted-foreground">
          {levelExercises.length} exercises · 5 hearts
        </p>
        {allExercisesSkipped ? (
          <div className="max-w-md text-center">
            <p className="mb-4 font-bold">
              This level only has listening exercises. Resume listening to start it now.
            </p>
            <Button size="lg" onClick={handleResumeListening}>
              Resume listening
            </Button>
          </div>
        ) : (
          <Button size="lg" onClick={handleStart}>
            Start Level
          </Button>
        )}
      </div>
    );
  }

  if (state.phase === "ready_to_complete") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-2xl font-black">Saving your progress...</h2>
        <p className="text-muted-foreground">Almost done.</p>
      </div>
    );
  }

  if (state.phase === "listening_skipped_empty") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
        <h2 className="text-2xl font-black">Listening skipped</h2>
        <p className="max-w-md text-muted-foreground">
          There are no non-listening exercises left in this level. Resume listening or return to
          the map.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={goToDashboard}>
            Back to map
          </Button>
          <Button onClick={handleResumeListening}>Resume listening</Button>
        </div>
      </div>
    );
  }

  if (state.phase === "failed") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h2 className="text-2xl font-black text-destructive">Out of hearts!</h2>
        <p className="text-muted-foreground">Try again when you&apos;re ready.</p>
        <Button onClick={goToDashboard}>Back to map</Button>
      </div>
    );
  }

  if (state.phase === "completed") {
    return (
      <CompletionScreen
        totalXp={state.totalXp}
        streak={state.streak}
        perfect={state.perfect}
        mistakes={state.mistakes}
        onContinue={goToDashboard}
      />
    );
  }

  const fixingMistakes =
    state.phase === "active" || state.phase === "answer_revealed"
      ? state.fixingMistakes
      : false;
  const mistakeCount =
    state.phase === "active" || state.phase === "answer_revealed"
      ? state.mistakeIds.length
      : 0;
  const activeLevelExerciseIds =
    state.phase === "active" || state.phase === "answer_revealed"
      ? state.levelIds
      : levelExerciseIds;
  const originalIndex = currentExercise
    ? Math.max(0, activeLevelExerciseIds.indexOf(currentExercise.id))
    : 0;
  const progressIndex = fixingMistakes
    ? activeLevelExerciseIds.length
    : originalIndex + (state.phase === "answer_revealed" ? 1 : 0);
  const progressTotal = Math.max(1, activeLevelExerciseIds.length + mistakeCount);
  const lives = state.lives;
  const revealed = state.phase === "answer_revealed";

  return (
    <div className="relative mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <ProgressBar current={progressIndex} total={progressTotal} />
        <HeartBar lives={lives} />
      </div>

      <XpPop show={showXpPop} />

      {listeningSkipActive && (
        <div className="mb-4 rounded-2xl border-2 border-border bg-muted px-4 py-3 text-sm font-bold text-muted-foreground">
          Listening skipped for {listeningRemainingMinutes} more min.
          <Button
            className="ml-0 mt-3 w-full md:ml-3 md:mt-0 md:w-auto"
            variant="outline"
            size="sm"
            onClick={handleResumeListening}
          >
            Resume listening
          </Button>
        </div>
      )}

      {fixingMistakes && (
        <div className="mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-center text-sm font-black text-orange-600">
          Fix your mistakes to finish the level.
        </div>
      )}

      {currentExercise?.type === "translation" && (
        <TranslationExercise
          prompt={currentExercise.prompt}
          options={currentExercise.options ?? []}
          selected={selected}
          revealed={revealed}
          correctAnswer={currentExercise.answer}
          onSelect={(option) => {
            if (revealed) return;
            setSelected(option);
            handleSubmit(option === currentExercise.answer);
          }}
          onContinue={handleContinue}
        />
      )}

      {currentExercise?.type === "match" && state.phase === "active" && (
        <MatchExercise
          key={currentExercise.id}
          answer={currentExercise.answer}
          onMistake={handleMatchMistake}
          onComplete={handleMatchComplete}
        />
      )}

      {currentExercise?.type === "fill_blank" && (
        <FillBlankExercise
          prompt={currentExercise.prompt}
          answer={currentExercise.answer}
          revealed={revealed}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
        />
      )}

      {currentExercise?.type === "listening" && (
        <ListeningExercise
          audioText={currentExercise.audioText ?? currentExercise.answer}
          answer={currentExercise.answer}
          revealed={revealed}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
          onSkipListening={handleSkipListening}
        />
      )}
    </div>
  );
}
