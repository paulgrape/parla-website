"use client";

import { useReducer, useState } from "react";
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
  | { phase: "active"; exerciseIndex: number; lives: number; xp: number; mistakes: number }
  | { phase: "answer_revealed"; exerciseIndex: number; lives: number; xp: number; mistakes: number; correct: boolean }
  | { phase: "completed"; totalXp: number; streak: number; perfect: boolean }
  | { phase: "failed" };

type LessonAction =
  | { type: "START" }
  | { type: "SUBMIT"; correct: boolean }
  | { type: "CONTINUE" }
  | { type: "MATCH_COMPLETE"; correct: boolean }
  | { type: "COMPLETE"; totalXp: number; streak: number; perfect: boolean }
  | { type: "FAIL" };

const MAX_LIVES = 5;

function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case "START":
      return { phase: "active", exerciseIndex: 0, lives: MAX_LIVES, xp: 0, mistakes: 0 };

    case "SUBMIT": {
      if (state.phase !== "active") return state;
      const xp = state.xp + (action.correct ? 10 : 0);
      const lives = action.correct ? state.lives : state.lives - 1;
      const mistakes = action.correct ? state.mistakes : state.mistakes + 1;

      if (lives <= 0) return { phase: "failed" };

      return {
        phase: "answer_revealed",
        exerciseIndex: state.exerciseIndex,
        lives,
        xp,
        mistakes,
        correct: action.correct,
      };
    }

    case "MATCH_COMPLETE": {
      if (state.phase !== "active") return state;
      const xp = state.xp + (action.correct ? 10 : 0);
      const lives = action.correct ? state.lives : state.lives - 1;
      const mistakes = action.correct ? state.mistakes : state.mistakes + 1;

      if (lives <= 0) return { phase: "failed" };

      if (action.correct) {
        return {
          phase: "active",
          exerciseIndex: state.exerciseIndex + 1,
          lives,
          xp,
          mistakes,
        };
      }
      return { ...state, lives, mistakes };
    }

    case "CONTINUE": {
      if (state.phase !== "answer_revealed") return state;
      return {
        phase: "active",
        exerciseIndex: state.exerciseIndex + 1,
        lives: state.lives,
        xp: state.xp,
        mistakes: state.mistakes,
      };
    }

    case "COMPLETE":
      return {
        phase: "completed",
        totalXp: action.totalXp,
        streak: action.streak,
        perfect: action.perfect,
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

  const currentExercise =
    state.phase === "active" || state.phase === "answer_revealed"
      ? exercises[state.exerciseIndex]
      : null;

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

  const handleContinue = async () => {
    if (state.phase !== "answer_revealed") return;

    const nextIndex = state.exerciseIndex + 1;
    if (nextIndex >= exercises.length) {
      const perfect = state.mistakes === 0;
      const totalXp = state.xp + (perfect ? 20 : 0);

      try {
        const result = await fetchApi<{ xpEarned: number; newStreak: number; totalXp: number }>(
          "/progress",
          {
            method: "POST",
            body: JSON.stringify({ lessonId, xpEarned: totalXp }),
          }
        );
        dispatch({
          type: "COMPLETE",
          totalXp,
          streak: result.newStreak,
          perfect,
        });
      } catch {
        dispatch({
          type: "COMPLETE",
          totalXp,
          streak: 0,
          perfect,
        });
      }
    } else {
      setSelected(null);
      dispatch({ type: "CONTINUE" });
    }
  };

  const handleMatchComplete = (correct: boolean) => {
    if (state.phase !== "active") return;

    if (correct) {
      setShowXpPop(true);
      setTimeout(() => setShowXpPop(false), 1000);
    }

    const nextIndex = state.exerciseIndex + 1;
    const xp = state.xp + (correct ? 10 : 0);
    const lives = correct ? state.lives : state.lives - 1;
    const mistakes = correct ? state.mistakes : state.mistakes + 1;

    if (!correct && lives <= 0) {
      dispatch({ type: "FAIL" });
      return;
    }

    if (correct && nextIndex >= exercises.length) {
      const perfect = mistakes === 0;
      const totalXp = xp + (perfect ? 20 : 0);

      fetchApi<{ newStreak: number }>("/progress", {
        method: "POST",
        body: JSON.stringify({ lessonId, xpEarned: totalXp }),
      })
        .then((result) => {
          dispatch({
            type: "COMPLETE",
            totalXp,
            streak: result.newStreak,
            perfect,
          });
        })
        .catch(() => {
          dispatch({
            type: "COMPLETE",
            totalXp,
            streak: 0,
            perfect,
          });
        });
      return;
    }

    dispatch({ type: "MATCH_COMPLETE", correct });
  };

  if (state.phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <h2 className="text-2xl font-black">Ready to learn?</h2>
        <p className="text-muted-foreground">{exercises.length} exercises · 5 hearts</p>
        <Button size="lg" onClick={() => dispatch({ type: "START" })}>
          Start Lesson
        </Button>
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
        onContinue={goToDashboard}
      />
    );
  }

  const progressIndex =
    state.phase === "answer_revealed" ? state.exerciseIndex + 1 : state.exerciseIndex;
  const lives = state.lives;
  const revealed = state.phase === "answer_revealed";

  return (
    <div className="relative mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <ProgressBar current={progressIndex} total={exercises.length} />
        <HeartBar lives={lives} />
      </div>

      <XpPop show={showXpPop} />

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
        />
      )}
    </div>
  );
}
