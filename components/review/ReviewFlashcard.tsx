'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import type {ReviewItem} from '@llp/types'
import {m} from 'framer-motion'

export const REVIEW_CARD_EXIT_MS = 280

interface ReviewFlashcardProps {
  item: ReviewItem
  flipped: boolean
  exiting: boolean
  onFlip: () => void
}

export function ReviewFlashcard({item, flipped, exiting, onFlip}: ReviewFlashcardProps) {
  const reducedMotion = useReducedMotion()
  const instant = reducedMotion

  return (
    <m.button
      type='button'
      data-testid='review-flashcard'
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `Showing English: ${item.english}. Press to show Italian.`
          : `Showing Italian: ${item.italian}. Press to show English.`
      }
      animate={exiting && !instant ? {opacity: 0, x: 80, scale: 0.95} : {opacity: 1, x: 0, scale: 1}}
      transition={{duration: instant ? 0 : 0.28, ease: 'easeIn'}}
      className={cn(
        'border-border bg-card focus-visible:ring-primary w-full cursor-pointer rounded-3xl border-2 p-6 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        flipped && 'border-primary bg-primary/5'
      )}
      style={{perspective: instant ? undefined : 1000}}
    >
      <div
        className='relative flex min-h-[200px] flex-col items-center justify-center'
        style={{
          transformStyle: instant ? undefined : 'preserve-3d',
          transform: instant ? undefined : `rotateY(${flipped ? 180 : 0}deg)`,
          transition: instant ? undefined : 'transform 0.4s ease'
        }}
      >
        <div
          className='flex w-full flex-col items-center justify-center'
          style={instant ? undefined : {backfaceVisibility: 'hidden'}}
        >
          {(!instant || !flipped) && (
            <>
              <p className='text-muted-foreground mb-2 text-sm font-bold uppercase'>Italian</p>
              <p className='text-3xl font-black'>{item.italian}</p>
              {!flipped && <p className='text-muted-foreground mt-4 text-xs'>Tap or press to flip</p>}
            </>
          )}

          {instant && flipped && (
            <>
              <p className='text-muted-foreground mb-2 text-sm font-bold uppercase'>English</p>
              <p className='text-3xl font-black'>{item.english}</p>
              <p className='text-muted-foreground mt-4 text-xs'>Tap or press to flip</p>
            </>
          )}
        </div>

        {!instant && (
          <div
            className='absolute inset-0 flex flex-col items-center justify-center'
            style={{transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}
          >
            <p className='text-muted-foreground mb-2 text-sm font-bold uppercase'>English</p>
            <p className='text-3xl font-black'>{item.english}</p>
            <p className='text-muted-foreground mt-4 text-xs'>Tap or press to flip</p>
          </div>
        )}
      </div>
    </m.button>
  )
}
