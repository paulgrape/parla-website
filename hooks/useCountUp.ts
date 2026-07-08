'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {useEffect, useRef, useState} from 'react'

interface UseCountUpOptions {
  durationMs?: number
}

export function useCountUp(target: number, {durationMs = 500}: UseCountUpOptions = {}) {
  const reducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(target)
  const previousTargetRef = useRef(target)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const from = previousTargetRef.current
    previousTargetRef.current = target

    if (reducedMotion || from === target) {
      setDisplay(target)
      return
    }

    const start = performance.now()
    const delta = target - from

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + delta * eased))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, durationMs, reducedMotion])

  return display
}
