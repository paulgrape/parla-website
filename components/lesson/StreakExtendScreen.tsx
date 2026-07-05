'use client'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { AnimatePresence, motion } from 'framer-motion'
import { FireIcon } from 'hugeicons-react'
import { useEffect, useId, useState } from 'react'

interface StreakExtendScreenProps {
  streak: number
  onContinue: () => void
}

export function StreakExtendScreen({
  streak,
  onContinue,
}: StreakExtendScreenProps) {
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()
  const previousStreak = Math.max(0, streak - 1)
  const [phase, setPhase] = useState<'start' | 'plus' | 'done'>(
    reducedMotion ? 'done' : 'start',
  )
  const [showContinue, setShowContinue] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return

    const plusTimer = window.setTimeout(() => setPhase('plus'), 600)
    const doneTimer = window.setTimeout(() => setPhase('done'), 1200)
    const continueTimer = window.setTimeout(() => setShowContinue(true), 1600)

    return () => {
      window.clearTimeout(plusTimer)
      window.clearTimeout(doneTimer)
      window.clearTimeout(continueTimer)
    }
  }, [reducedMotion])

  const fireActive = phase === 'done' || reducedMotion
  const displayValue =
    phase === 'start'
      ? previousStreak
      : phase === 'plus'
        ? '+1'
        : streak

  return (
    <Dialog
      open
      titleId={titleId}
      descriptionId={descriptionId}
      onClose={onContinue}
      closeOnEscape={false}
      className='bg-background/95'
      panelClassName='w-full max-w-md'
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
        className='relative flex flex-col items-center gap-6 px-6 pt-6 pb-24 text-center'
      >
        <motion.div
          initial={reducedMotion ? false : { scale: 0.85 }}
          animate={{ scale: fireActive ? 1 : 0.92 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : fireActive
                ? { type: 'spring', stiffness: 380, damping: 16 }
                : { duration: 0.35 }
          }
          className={`flex h-28 w-28 items-center justify-center rounded-full transition-colors duration-700 ${
            fireActive ? 'bg-orange-500' : 'bg-muted'
          }`}
          aria-hidden
        >
          <motion.div
            animate={
              fireActive && !reducedMotion
                ? { scale: [1, 1.12, 1], rotate: [0, -8, 8, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.65, ease: 'easeInOut' }
            }
          >
            <FireIcon
              size={56}
              strokeWidth={2}
              className={
                fireActive ? 'text-white' : 'text-muted-foreground'
              }
              fill={fireActive ? 'currentColor' : 'none'}
            />
          </motion.div>
        </motion.div>

        <div>
          <h2
            id={titleId}
            className='text-3xl font-black font-display text-foreground'
          >
            Streak extended!
          </h2>
          <p
            id={descriptionId}
            className='mt-2 text-sm font-bold text-muted-foreground'
          >
            You showed up today. Keep it going.
          </p>
        </div>

        <div className='relative flex h-20 items-center justify-center'>
          <AnimatePresence mode='wait'>
            <motion.p
              key={displayValue}
              initial={
                reducedMotion ? false : { opacity: 0, y: 16, scale: 0.85 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -16, scale: 0.85 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 300, damping: 22 }
              }
              className={`text-6xl font-black tabular-nums md:text-7xl ${
                fireActive ? 'text-orange-500' : 'text-muted-foreground'
              }`}
              aria-live='polite'
            >
              {displayValue}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showContinue && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
              className='absolute inset-x-6 bottom-6'
            >
              <Button
                onClick={onContinue}
                size='lg'
                className='w-full'
              >
                Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Dialog>
  )
}
