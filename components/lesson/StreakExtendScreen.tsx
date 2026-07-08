'use client'

import {Button} from '@/components/ui/button'
import {Dialog} from '@/components/ui/dialog'
import {MotionDialogPanel, SlideUp} from '@/components/ui/motion'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {AnimatePresence, m} from 'framer-motion'
import {FireIcon} from 'hugeicons-react'
import {useEffect, useId, useState} from 'react'

interface StreakExtendScreenProps {
  streak: number
  onContinue: () => void
}

export function StreakExtendScreen({streak, onContinue}: StreakExtendScreenProps) {
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()
  const previousStreak = Math.max(0, streak - 1)
  const [phase, setPhase] = useState<'start' | 'plus' | 'done'>(reducedMotion ? 'done' : 'start')
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
  const displayValue = phase === 'start' ? previousStreak : phase === 'plus' ? '+1' : streak

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
      <MotionDialogPanel className='relative flex flex-col items-center gap-6 px-6 pt-6 pb-24 text-center'>
        <m.div
          initial={reducedMotion ? false : {scale: 0.85}}
          animate={{scale: fireActive ? 1 : 0.92}}
          transition={
            reducedMotion
              ? {duration: 0}
              : fireActive
                ? {type: 'spring', stiffness: 380, damping: 16}
                : {duration: 0.35}
          }
          className={`flex h-28 w-28 items-center justify-center rounded-full transition-colors duration-700 ${
            fireActive ? 'bg-orange-500' : 'bg-muted'
          }`}
          aria-hidden
        >
          <m.div
            animate={
              fireActive && !reducedMotion ? {scale: [1, 1.12, 1], rotate: [0, -8, 8, 0]} : {scale: 1, rotate: 0}
            }
            transition={reducedMotion ? {duration: 0} : {duration: 0.65, ease: 'easeInOut'}}
          >
            <FireIcon
              size={56}
              strokeWidth={2}
              className={fireActive ? 'text-white' : 'text-muted-foreground'}
              fill={fireActive ? 'currentColor' : 'none'}
            />
          </m.div>
        </m.div>

        <div>
          <h2
            id={titleId}
            className='font-display text-foreground text-3xl font-black'
          >
            Streak extended!
          </h2>
          <p
            id={descriptionId}
            className='text-muted-foreground mt-2 text-sm font-bold'
          >
            You showed up today. Keep it going.
          </p>
        </div>

        <div className='relative flex h-20 items-center justify-center'>
          <AnimatePresence mode='wait'>
            <m.p
              key={displayValue}
              initial={reducedMotion ? false : {opacity: 0, y: 16, scale: 0.85}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={reducedMotion ? undefined : {opacity: 0, y: -16, scale: 0.85}}
              transition={reducedMotion ? {duration: 0} : {type: 'spring', stiffness: 300, damping: 22}}
              className={`text-6xl font-black tabular-nums md:text-7xl ${
                fireActive ? 'text-orange-500' : 'text-muted-foreground'
              }`}
              aria-live='polite'
            >
              {displayValue}
            </m.p>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showContinue && (
            <SlideUp className='absolute inset-x-6 bottom-6'>
              <Button
                onClick={onContinue}
                size='lg'
                className='w-full'
              >
                Continue
              </Button>
            </SlideUp>
          )}
        </AnimatePresence>
      </MotionDialogPanel>
    </Dialog>
  )
}
