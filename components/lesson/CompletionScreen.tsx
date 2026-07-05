'use client'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { AnimatePresence, motion } from 'framer-motion'
import { FireIcon, StarIcon } from 'hugeicons-react'
import { useEffect, useId, useState } from 'react'

interface CompletionScreenProps {
  totalXp: number
  streak: number
  perfect: boolean
  mistakes: number
  onContinue: () => void
}

export function CompletionScreen({
  totalXp,
  streak,
  perfect,
  mistakes,
  onContinue,
}: CompletionScreenProps) {
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()
  const [showContinue, setShowContinue] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return

    const continueTimer = window.setTimeout(() => setShowContinue(true), 1000)

    return () => {
      window.clearTimeout(continueTimer)
    }
  }, [reducedMotion])

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
        transition={reducedMotion ? { duration: 0 } : undefined}
        className='relative flex flex-col items-center gap-6 px-6 pt-6 pb-24 text-center'
      >
        <motion.div
          initial={reducedMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', delay: 0.2 }
          }
          className='flex h-24 w-24 items-center justify-center rounded-full bg-primary'
          aria-hidden
        >
          <StarIcon
            size={48}
            strokeWidth={2}
            className='text-white'
            fill='currentColor'
          />
        </motion.div>

        <div>
          <h2
            id={titleId}
            className='text-3xl font-black text-primary font-display'
          >
            Level Complete!
          </h2>
          {perfect && (
            <p
              id={descriptionId}
              className='mt-2 text-sm font-bold text-orange-500'
            >
              Perfect level! +20 bonus XP
            </p>
          )}
          {!perfect && mistakes > 0 && (
            <p
              id={descriptionId}
              className='mt-2 text-sm font-bold text-primary'
            >
              Nice recovery. You fixed {mistakes} mistake
              {mistakes === 1 ? '' : 's'}.
            </p>
          )}
          {!perfect && mistakes === 0 && (
            <p
              id={descriptionId}
              className='sr-only'
            >
              Level completed.
            </p>
          )}
        </div>

        <div className='flex gap-6 md:gap-8'>
          <div>
            <p className='text-sm font-bold uppercase text-muted-foreground'>
              XP Earned
            </p>
            <p className='text-3xl font-black text-primary md:text-4xl'>
              {totalXp}
            </p>
          </div>
          <div>
            <p className='text-sm font-bold uppercase text-muted-foreground'>
              Streak
            </p>
            <p className='flex items-center justify-center gap-1 text-3xl font-black text-orange-500 md:text-4xl'>
              <FireIcon
                size={22}
                strokeWidth={2}
                aria-hidden
              />
              {streak}
            </p>
          </div>
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
