'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {m} from 'framer-motion'
import {FavouriteIcon} from 'hugeicons-react'
import {useEffect, useRef, useState} from 'react'

interface HeartBarProps {
  lives: number
  maxLives?: number
}

export function HeartBar({lives, maxLives = 5}: HeartBarProps) {
  const reducedMotion = useReducedMotion()
  const previousLivesRef = useRef(lives)
  const [lostHeartIndex, setLostHeartIndex] = useState<number | null>(null)
  const label = `${lives} of ${maxLives} lives remaining`

  useEffect(() => {
    const previousLives = previousLivesRef.current

    if (lives < previousLives) {
      setLostHeartIndex(previousLives - 1)

      const timer = window.setTimeout(() => setLostHeartIndex(null), reducedMotion ? 0 : 350)

      previousLivesRef.current = lives
      return () => window.clearTimeout(timer)
    }

    previousLivesRef.current = lives
  }, [lives, reducedMotion])

  return (
    <div
      className='flex items-center gap-1'
      aria-label={label}
    >
      {Array.from({length: maxLives}).map((_, i) => {
        const filled = i < lives
        const isLost = lostHeartIndex === i

        return (
          <m.span
            key={i}
            animate={isLost && !reducedMotion ? {scale: [1, 1.35, 0.9, 1], x: [0, -4, 4, -2, 2, 0]} : {scale: 1, x: 0}}
            transition={isLost && !reducedMotion ? {duration: 0.35, ease: 'easeOut'} : {duration: 0}}
            className='inline-flex'
          >
            <FavouriteIcon
              size={24}
              strokeWidth={2}
              aria-hidden
              className={cn(
                'transition-colors duration-200',
                filled ? 'text-destructive' : 'text-muted',
                isLost && !filled && 'text-destructive/40'
              )}
              fill={filled ? 'currentColor' : 'none'}
            />
          </m.span>
        )
      })}
    </div>
  )
}
