'use client'

import {Button} from '@/components/ui/button'
import {Dialog} from '@/components/ui/dialog'
import {MotionDialogPanel, SlideUp} from '@/components/ui/motion'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {AnimatePresence, m} from 'framer-motion'
import {StarIcon} from 'hugeicons-react'
import {useEffect, useId, useState} from 'react'

interface LevelUpScreenProps {
  level: number
  onContinue: () => void
}

export function LevelUpScreen({level, onContinue}: LevelUpScreenProps) {
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
      <MotionDialogPanel className='relative flex flex-col items-center gap-6 px-6 pt-6 pb-24 text-center'>
        <m.div
          initial={reducedMotion ? false : {scale: 0}}
          animate={{scale: 1}}
          transition={reducedMotion ? {duration: 0} : {type: 'spring', delay: 0.15, stiffness: 320, damping: 18}}
          className='bg-primary flex h-24 w-24 items-center justify-center rounded-full'
          aria-hidden
        >
          <StarIcon
            size={48}
            strokeWidth={2}
            className='text-white'
            fill='currentColor'
          />
        </m.div>

        <div>
          <h2
            id={titleId}
            className='text-primary font-display text-3xl font-black'
          >
            Level up!
          </h2>
          <p
            id={descriptionId}
            className='text-muted-foreground mt-2 text-sm font-bold'
          >
            You reached XP level {level}. Keep going!
          </p>
        </div>

        <m.p
          initial={reducedMotion ? false : {opacity: 0, scale: 0.85}}
          animate={{opacity: 1, scale: 1}}
          transition={reducedMotion ? {duration: 0} : {type: 'spring', delay: 0.3, stiffness: 300, damping: 20}}
          className='text-primary text-6xl font-black tabular-nums md:text-7xl'
          aria-hidden
        >
          {level}
        </m.p>

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
