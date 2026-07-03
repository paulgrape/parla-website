// Shared API shapes — keep in sync with packages/types in the monorepo.

export type ExerciseType = 'translation' | 'match' | 'fill_blank' | 'listening'

export interface GrammarConcept {
  title: string
  content: string
}

export interface Section {
  id: string
  title: string
  description: string
  order: number
  cefrLevel: string
  cefrDescription: string
  exampleSentence: string
  exampleTranslation: string
  grammarConcepts: GrammarConcept[]
  unitCount?: number
  lessonCount?: number
  completedCount?: number
}

export interface Unit {
  id: string
  sectionId: string
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
  extendedToday: boolean
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
  streakExtended: boolean
}

export interface GuidebookPhrase {
  italian: string
  english: string
  audioText: string | null
  order: number
}

export interface Guidebook {
  unitId: string
  unitTitle: string
  grammarTips: string
  phrases: GuidebookPhrase[]
}
