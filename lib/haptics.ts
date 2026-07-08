import {isHapticsEnabled} from '@/hooks/useHapticsEnabled'

export type HapticPattern = 'correct' | 'wrong' | 'click'

const PATTERNS: Record<HapticPattern, number | number[]> = {
  click: 8,
  correct: 12,
  wrong: [20, 40, 20]
}

export function vibrate(pattern: HapticPattern) {
  if (typeof window === 'undefined' || !isHapticsEnabled()) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!('vibrate' in navigator)) return

  try {
    navigator.vibrate(PATTERNS[pattern])
  } catch {
    // Some browsers expose vibrate but reject calls outside a user gesture.
  }
}
