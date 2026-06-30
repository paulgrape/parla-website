// Shared API shapes — keep in sync with packages/types in the monorepo.

export type ExerciseType = 'translation' | 'match' | 'fill_blank' | 'listening'

export interface Unit {
  id: string
  title: string
  description: string | null
  order: number
  lessonCount?: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  order: number
}

export interface Exercise {
  id: string
  lessonId: string
  type: ExerciseType
  prompt: string
  answer: string
  options: string[] | null
  audioText: string | null
  order: number
  isNew?: boolean
}

export interface UserStats {
  xp: number
  streak: number
  streakActive: boolean
  longestStreak: number
  completedLessons: string[]
  nextReview: number
  hearts: number
  maxHearts: number
  nextHeartAt: number | null
}

export interface HeartsState {
  hearts: number
  maxHearts: number
  nextHeartAt: number | null
}

export interface ReviewItem {
  id: string
  vocabularyId: string
  italian: string
  english: string
  interval: number
  repetitions: number
  easeFactor: number
}

export interface ProgressResult {
  xpEarned: number
  newStreak: number
  totalXp: number
}
