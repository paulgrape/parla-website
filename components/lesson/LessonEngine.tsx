'use client'

import { useUserStats } from '@/components/providers/UserStatsProvider'
import { Button } from '@/components/ui/button'
import { useApi } from '@/lib/api'
import { playSound } from '@/lib/sound'
import type { Exercise } from '@llp/types'
import { Cancel01Icon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { CompletionScreen } from './CompletionScreen'
import { StreakExtendScreen } from './StreakExtendScreen'
import { FillBlankExercise } from './exercises/FillBlankExercise'
import { ListeningExercise } from './exercises/ListeningExercise'
import { MatchExercise } from './exercises/MatchExercise'
import { TranslationExercise, XpPop } from './exercises/TranslationExercise'
import { HeartBar } from './HeartBar'
import { ProgressBar } from './ProgressBar'
import { QuitDialog } from './QuitDialog'
import { ResultDialog } from './ResultDialog'

const CORRECT_TITLES = [
  'Well done!',
  'Good job!',
  'Awesome!',
  'Great!',
  'Nice!',
]

function pickCorrectTitle() {
  return CORRECT_TITLES[Math.floor(Math.random() * CORRECT_TITLES.length)]
}

function formatHeartCountdown(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }
  return `${totalMinutes} min`
}

type LessonState =
  | { phase: 'idle' }
  | ActiveLessonState
  | RevealedLessonState
  | {
      phase: 'ready_to_complete'
      totalXp: number
      perfect: boolean
      mistakes: number
    }
  | {
      phase: 'completed'
      totalXp: number
      streak: number
      streakExtended: boolean
      perfect: boolean
      mistakes: number
    }
  | { phase: 'listening_skipped_empty' }
  | { phase: 'failed' }

interface ActiveLessonState {
  phase: 'active'
  levelIds: string[]
  currentId: string
  remainingIds: string[]
  mistakeIds: string[]
  fixingMistakes: boolean
  lives: number
  xp: number
  mistakes: number
  earnedIds: string[]
}

interface RevealedLessonState extends Omit<ActiveLessonState, 'phase'> {
  phase: 'answer_revealed'
  correct: boolean
}

type LessonAction =
  | { type: 'START'; exerciseIds: string[]; lives: number }
  | { type: 'SUBMIT'; correct: boolean }
  | { type: 'CONTINUE' }
  | { type: 'MATCH_MISTAKE' }
  | { type: 'MATCH_COMPLETE' }
  | {
      type: 'SKIP_LISTENING'
      listeningIds: string[]
      nonListeningIds: string[]
    }
  | {
      type: 'COMPLETE'
      totalXp: number
      streak: number
      streakExtended: boolean
      perfect: boolean
      mistakes: number
    }
  | { type: 'FAIL' }

const XP_PER_EXERCISE = 10
const PERFECT_BONUS_XP = 20
const LISTENING_SKIP_MINUTES = 15
const LISTENING_SKIP_STORAGE_KEY = 'llp:listeningSkipUntil'

function addUnique(items: string[], item: string) {
  return items.includes(item) ? items : [...items, item]
}

function removeItems(items: string[], itemsToRemove: string[]) {
  return items.filter(item => !itemsToRemove.includes(item))
}

function removeCurrentMistakeIfFixed(
  state: ActiveLessonState,
  correct: boolean,
) {
  if (!correct || !state.fixingMistakes) return state.mistakeIds
  return state.mistakeIds.filter(id => id !== state.currentId)
}

function awardXpOnce(state: ActiveLessonState, correct: boolean) {
  if (!correct || state.earnedIds.includes(state.currentId)) {
    return { xp: state.xp, earnedIds: state.earnedIds }
  }

  return {
    xp: state.xp + XP_PER_EXERCISE,
    earnedIds: [...state.earnedIds, state.currentId],
  }
}

function readyToComplete(
  state: Pick<ActiveLessonState, 'xp' | 'mistakes'>,
): LessonState {
  const perfect = state.mistakes === 0
  return {
    phase: 'ready_to_complete',
    totalXp: state.xp + (perfect ? PERFECT_BONUS_XP : 0),
    perfect,
    mistakes: state.mistakes,
  }
}

function advanceLesson(state: ActiveLessonState): LessonState {
  const [nextId, ...remainingIds] = state.remainingIds
  if (nextId) {
    return {
      ...state,
      phase: 'active',
      currentId: nextId,
      remainingIds,
      fixingMistakes: false,
    }
  }

  const [mistakeId] = state.mistakeIds
  if (mistakeId) {
    return {
      ...state,
      phase: 'active',
      currentId: mistakeId,
      remainingIds: [],
      fixingMistakes: true,
    }
  }

  return readyToComplete(state)
}

function lessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'START': {
      const [currentId, ...remainingIds] = action.exerciseIds
      if (!currentId) return { phase: 'listening_skipped_empty' }

      return {
        phase: 'active',
        levelIds: action.exerciseIds,
        currentId,
        remainingIds,
        mistakeIds: [],
        fixingMistakes: false,
        lives: action.lives,
        xp: 0,
        mistakes: 0,
        earnedIds: [],
      }
    }

    case 'SUBMIT': {
      if (state.phase !== 'active') return state
      const { xp, earnedIds } = awardXpOnce(state, action.correct)
      const lives = action.correct ? state.lives : state.lives - 1
      const mistakes = action.correct ? state.mistakes : state.mistakes + 1
      const mistakeIds = action.correct
        ? removeCurrentMistakeIfFixed(state, true)
        : addUnique(state.mistakeIds, state.currentId)

      if (lives <= 0) return { phase: 'failed' }

      return {
        phase: 'answer_revealed',
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
      }
    }

    case 'MATCH_MISTAKE': {
      if (state.phase !== 'active') return state
      const lives = state.lives - 1

      if (lives <= 0) return { phase: 'failed' }

      return {
        ...state,
        lives,
        mistakes: state.mistakes + 1,
        mistakeIds: addUnique(state.mistakeIds, state.currentId),
      }
    }

    case 'MATCH_COMPLETE': {
      if (state.phase !== 'active') return state
      const { xp, earnedIds } = awardXpOnce(state, true)
      const nextState: ActiveLessonState = {
        ...state,
        xp,
        earnedIds,
        mistakeIds: removeCurrentMistakeIfFixed(state, true),
      }

      return advanceLesson(nextState)
    }

    case 'CONTINUE': {
      if (state.phase !== 'answer_revealed') return state
      return advanceLesson({
        phase: 'active',
        levelIds: state.levelIds,
        currentId: state.currentId,
        remainingIds: state.remainingIds,
        mistakeIds: state.mistakeIds,
        fixingMistakes: state.fixingMistakes,
        lives: state.lives,
        xp: state.xp,
        mistakes: state.mistakes,
        earnedIds: state.earnedIds,
      })
    }

    case 'SKIP_LISTENING': {
      if (state.phase !== 'active' && state.phase !== 'answer_revealed')
        return state

      const remainingIds = removeItems(state.remainingIds, action.listeningIds)
      const mistakeIds = removeItems(state.mistakeIds, action.listeningIds)
      const levelIds = removeItems(state.levelIds, action.listeningIds)
      const currentWasSkipped = action.listeningIds.includes(state.currentId)
      const allLevelExercisesAreListening = action.nonListeningIds.length === 0

      if (!currentWasSkipped) {
        return {
          ...state,
          levelIds,
          remainingIds,
          mistakeIds,
        }
      }

      if (allLevelExercisesAreListening && state.earnedIds.length === 0) {
        return { phase: 'listening_skipped_empty' }
      }

      return advanceLesson({
        phase: 'active',
        levelIds,
        currentId: state.currentId,
        remainingIds,
        mistakeIds,
        fixingMistakes: state.fixingMistakes,
        lives: state.lives,
        xp: state.xp,
        mistakes: state.mistakes,
        earnedIds: state.earnedIds,
      })
    }

    case 'COMPLETE':
      return {
        phase: 'completed',
        totalXp: action.totalXp,
        streak: action.streak,
        streakExtended: action.streakExtended,
        perfect: action.perfect,
        mistakes: action.mistakes,
      }

    case 'FAIL':
      return { phase: 'failed' }

    default:
      return state
  }
}

interface LessonEngineProps {
  lessonId: string
  exercises: Exercise[]
}

export function LessonEngine({ lessonId, exercises }: LessonEngineProps) {
  const router = useRouter()
  const { fetchApi } = useApi()
  const { stats, loading, loseHeart } = useUserStats()
  const [state, dispatch] = useReducer(lessonReducer, { phase: 'idle' })
  const [selected, setSelected] = useState<string | null>(null)
  const [showXpPop, setShowXpPop] = useState(false)
  const [showQuitDialog, setShowQuitDialog] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [correctTitle, setCorrectTitle] = useState(CORRECT_TITLES[0])
  const [listeningSkipUntil, setListeningSkipUntil] = useState<number | null>(
    () => {
      if (typeof window === 'undefined') return null

      const stored = window.localStorage.getItem(LISTENING_SKIP_STORAGE_KEY)
      const skipUntil = stored ? Number(stored) : null
      if (skipUntil && Number.isFinite(skipUntil) && skipUntil > Date.now()) {
        return skipUntil
      }

      window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY)
      return null
    },
  )
  const [now, setNow] = useState(() => Date.now())
  const [streakScreenDone, setStreakScreenDone] = useState(false)
  const completionPostingRef = useRef(false)

  const maxHearts = stats?.maxHearts ?? 5
  const hearts = stats?.hearts ?? stats?.maxHearts ?? 5
  const nextHeartAt = stats?.nextHeartAt ?? null
  const heartRegenLabel =
    nextHeartAt && nextHeartAt > now
      ? formatHeartCountdown(nextHeartAt - now)
      : null

  const listeningSkipActive =
    listeningSkipUntil !== null && listeningSkipUntil > now

  const levelExercises = useMemo(
    () =>
      exercises.filter(
        exercise => !listeningSkipActive || exercise.type !== 'listening',
      ),
    [exercises, listeningSkipActive],
  )

  const levelExerciseIds = useMemo(
    () => levelExercises.map(exercise => exercise.id),
    [levelExercises],
  )

  const exercisesById = useMemo(
    () => new Map(exercises.map(exercise => [exercise.id, exercise])),
    [exercises],
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentTime = Date.now()
      setNow(currentTime)

      if (listeningSkipUntil && listeningSkipUntil <= currentTime) {
        setListeningSkipUntil(null)
        window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY)
      }
    }, 1000)

    return () => window.clearInterval(interval)
  }, [listeningSkipUntil])

  const currentExercise =
    state.phase === 'active' || state.phase === 'answer_revealed'
      ? (exercisesById.get(state.currentId) ?? null)
      : null

  useEffect(() => {
    if (state.phase !== 'ready_to_complete' || completionPostingRef.current)
      return

    completionPostingRef.current = true
    fetchApi<{
      xpEarned: number
      newStreak: number
      totalXp: number
      streakExtended: boolean
    }>(
      '/progress',
      {
        method: 'POST',
        body: JSON.stringify({ lessonId, xpEarned: state.totalXp }),
      },
    )
      .then(result => {
        dispatch({
          type: 'COMPLETE',
          totalXp: state.totalXp,
          streak: result.newStreak,
          streakExtended: result.streakExtended,
          perfect: state.perfect,
          mistakes: state.mistakes,
        })
      })
      .catch(() => {
        dispatch({
          type: 'COMPLETE',
          totalXp: state.totalXp,
          streak: 0,
          streakExtended: false,
          perfect: state.perfect,
          mistakes: state.mistakes,
        })
      })
  }, [fetchApi, lessonId, state])

  const goToDashboard = () => {
    router.push('/dashboard')
    router.refresh()
  }

  const handleSubmit = (correct: boolean) => {
    playSound(correct ? 'correct' : 'wrong')
    if (correct) {
      setShowXpPop(true)
      setTimeout(() => setShowXpPop(false), 1000)
    } else {
      void loseHeart()
    }
    dispatch({ type: 'SUBMIT', correct })
  }

  const handleTranslationCheck = () => {
    if (state.phase !== 'active' || !selected || !currentExercise) return
    const correct = selected === currentExercise.answer
    if (correct) setCorrectTitle(pickCorrectTitle())
    handleSubmit(correct)
  }

  const handleContinue = () => {
    if (state.phase !== 'answer_revealed') return

    setSelected(null)
    dispatch({ type: 'CONTINUE' })
  }

  const handleMatchMistake = () => {
    if (state.phase !== 'active') return
    playSound('wrong')
    void loseHeart()
    dispatch({ type: 'MATCH_MISTAKE' })
  }

  const handleClose = () => {
    const hasProgress =
      (state.phase === 'active' || state.phase === 'answer_revealed') &&
      state.earnedIds.length > 0

    if (hasProgress) {
      setShowQuitDialog(true)
    } else {
      goToDashboard()
    }
  }

  const requestSkipListening = () => {
    setShowSkipDialog(true)
  }

  const confirmSkipListening = () => {
    setShowSkipDialog(false)
    handleSkipListening()
  }

  const handleMatchComplete = () => {
    if (state.phase !== 'active') return

    playSound('correct')
    setShowXpPop(true)
    setTimeout(() => setShowXpPop(false), 1000)
    dispatch({ type: 'MATCH_COMPLETE' })
  }

  const handleStart = () => {
    if (hearts <= 0) return
    completionPostingRef.current = false
    setStreakScreenDone(false)
    dispatch({ type: 'START', exerciseIds: levelExerciseIds, lives: hearts })
  }

  const handleSkipListening = () => {
    const skipUntil = Date.now() + LISTENING_SKIP_MINUTES * 60 * 1000
    window.localStorage.setItem(LISTENING_SKIP_STORAGE_KEY, String(skipUntil))
    setListeningSkipUntil(skipUntil)
    setNow(Date.now())
    setSelected(null)
    dispatch({
      type: 'SKIP_LISTENING',
      listeningIds: exercises
        .filter(exercise => exercise.type === 'listening')
        .map(exercise => exercise.id),
      nonListeningIds: exercises
        .filter(exercise => exercise.type !== 'listening')
        .map(exercise => exercise.id),
    })
  }

  const handleResumeListening = () => {
    window.localStorage.removeItem(LISTENING_SKIP_STORAGE_KEY)
    setListeningSkipUntil(null)
    setNow(Date.now())
  }

  if (state.phase === 'idle') {
    if (loading && !stats) {
      return (
        <p className='py-20 text-center text-muted-foreground'>
          Loading your hearts...
        </p>
      )
    }

    if (!loading && hearts <= 0) {
      return (
        <div className='flex flex-col items-center justify-center gap-6 py-20 text-center'>
          <h2 className='text-2xl font-black text-destructive'>
            Out of hearts!
          </h2>
          <p className='max-w-md text-muted-foreground'>
            {heartRegenLabel
              ? `You need at least one heart to start a level. Your next heart arrives in ${heartRegenLabel}.`
              : 'You need at least one heart to start a level.'}
          </p>
          <Button onClick={goToDashboard}>Back to map</Button>
        </div>
      )
    }

    const allExercisesSkipped =
      levelExercises.length === 0 && exercises.length > 0

    return (
      <div className='flex flex-col items-center justify-center gap-6 py-20'>
        <h2 className='text-2xl font-black'>Ready for this level?</h2>
        <p className='text-muted-foreground'>
          {levelExercises.length} exercises · {hearts}/{maxHearts} hearts
        </p>
        {allExercisesSkipped ? (
          <div className='max-w-md text-center'>
            <p className='mb-4 font-bold'>
              This level only has listening exercises. Resume listening to start
              it now.
            </p>
            <Button
              size='lg'
              onClick={handleResumeListening}
            >
              Resume listening
            </Button>
          </div>
        ) : (
          <Button
            size='lg'
            onClick={handleStart}
          >
            Start Level
          </Button>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={goToDashboard}
        >
          Back to map
        </Button>
      </div>
    )
  }

  if (state.phase === 'ready_to_complete') {
    return (
      <div className='flex flex-col items-center justify-center gap-4 py-20'>
        <h2 className='text-2xl font-black'>Saving your progress...</h2>
        <p className='text-muted-foreground'>Almost done.</p>
      </div>
    )
  }

  if (state.phase === 'listening_skipped_empty') {
    return (
      <div className='flex flex-col items-center justify-center gap-6 py-20 text-center'>
        <h2 className='text-2xl font-black'>Listening skipped</h2>
        <p className='max-w-md text-muted-foreground'>
          There are no non-listening exercises left in this level. Resume
          listening or return to the map.
        </p>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={goToDashboard}
          >
            Back to map
          </Button>
          <Button onClick={handleResumeListening}>Resume listening</Button>
        </div>
      </div>
    )
  }

  if (state.phase === 'failed') {
    return (
      <div className='flex flex-col items-center justify-center gap-6 py-20 text-center'>
        <h2 className='text-2xl font-black text-destructive'>Out of hearts!</h2>
        <p className='max-w-md text-muted-foreground'>
          {heartRegenLabel
            ? `This level wasn't saved. Your next heart arrives in ${heartRegenLabel}.`
            : "This level wasn't saved. Come back when your hearts refill."}
        </p>
        <Button onClick={goToDashboard}>Back to map</Button>
      </div>
    )
  }

  if (state.phase === 'completed') {
    if (state.streakExtended && !streakScreenDone) {
      return (
        <StreakExtendScreen
          streak={state.streak}
          onContinue={() => setStreakScreenDone(true)}
        />
      )
    }

    return (
      <CompletionScreen
        totalXp={state.totalXp}
        streak={state.streak}
        perfect={state.perfect}
        mistakes={state.mistakes}
        onContinue={goToDashboard}
      />
    )
  }

  const fixingMistakes =
    state.phase === 'active' || state.phase === 'answer_revealed'
      ? state.fixingMistakes
      : false
  const mistakeCount =
    state.phase === 'active' || state.phase === 'answer_revealed'
      ? state.mistakeIds.length
      : 0
  const activeLevelExerciseIds =
    state.phase === 'active' || state.phase === 'answer_revealed'
      ? state.levelIds
      : levelExerciseIds
  const originalIndex = currentExercise
    ? Math.max(0, activeLevelExerciseIds.indexOf(currentExercise.id))
    : 0
  const progressIndex = fixingMistakes
    ? activeLevelExerciseIds.length
    : originalIndex + (state.phase === 'answer_revealed' ? 1 : 0)
  const progressTotal = Math.max(
    1,
    activeLevelExerciseIds.length + mistakeCount,
  )
  const lives = state.lives
  const revealed = state.phase === 'answer_revealed'

  const showTranslationResult =
    revealed && currentExercise?.type === 'translation'

  return (
    <div className='relative mx-auto max-w-lg px-4 py-6'>
      <h1 className='sr-only'>Lesson in progress</h1>
      <div className='mb-6 flex items-center gap-3'>
        <button
          type='button'
          aria-label='Close level'
          onClick={handleClose}
          className='-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        >
          <Cancel01Icon
            size={22}
            strokeWidth={2.5}
            aria-hidden
          />
        </button>
        <ProgressBar
          current={progressIndex}
          total={progressTotal}
        />
        <HeartBar
          lives={lives}
          maxLives={maxHearts}
        />
      </div>

      <XpPop show={showXpPop} />

      {fixingMistakes && (
        <div
          role='status'
          className='mb-4 rounded-2xl bg-orange-50 px-4 py-3 text-center text-sm font-black text-orange-600'
        >
          Fix your mistakes to finish the level.
        </div>
      )}

      {currentExercise?.type === 'translation' && (
        <TranslationExercise
          prompt={currentExercise.prompt}
          options={currentExercise.options ?? []}
          selected={selected}
          revealed={revealed}
          correctAnswer={currentExercise.answer}
          isNew={currentExercise.isNew}
          onSelect={option => {
            if (revealed) return
            setSelected(option)
          }}
          onCheck={handleTranslationCheck}
        />
      )}

      {currentExercise?.type === 'match' && state.phase === 'active' && (
        <MatchExercise
          key={currentExercise.id}
          answer={currentExercise.answer}
          onMistake={handleMatchMistake}
          onComplete={handleMatchComplete}
        />
      )}

      {currentExercise?.type === 'fill_blank' && (
        <FillBlankExercise
          prompt={currentExercise.prompt}
          answer={currentExercise.answer}
          revealed={revealed}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
        />
      )}

      {currentExercise?.type === 'listening' && (
        <ListeningExercise
          audioText={currentExercise.audioText ?? currentExercise.answer}
          answer={currentExercise.answer}
          revealed={revealed}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
          onSkipListening={requestSkipListening}
        />
      )}

      <ResultDialog
        open={showTranslationResult}
        variant={
          state.phase === 'answer_revealed' && state.correct
            ? 'correct'
            : 'wrong'
        }
        title={
          state.phase === 'answer_revealed' && state.correct
            ? correctTitle
            : 'Not quite'
        }
        correctAnswer={
          state.phase === 'answer_revealed' && !state.correct
            ? currentExercise?.answer
            : undefined
        }
        onContinue={handleContinue}
      />

      <ResultDialog
        open={showSkipDialog}
        variant='info'
        title='Listening paused'
        message='Listening exercises will be skipped for 15 minutes.'
        onContinue={confirmSkipListening}
      />

      <QuitDialog
        open={showQuitDialog}
        onCancel={() => setShowQuitDialog(false)}
        onConfirm={goToDashboard}
      />
    </div>
  )
}
