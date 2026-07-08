'use client'

import {Button} from '@/components/ui/button'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {m} from 'framer-motion'
import {Tick01Icon} from 'hugeicons-react'

interface ReviewCompleteProps {
  onBack: () => void
}

export function ReviewComplete({onBack}: ReviewCompleteProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className='mx-auto max-w-md space-y-4 py-20 text-center'
      data-testid='review-complete'
    >
      <m.div
        initial={reducedMotion ? false : {scale: 0}}
        animate={{scale: 1}}
        transition={reducedMotion ? {duration: 0} : {type: 'spring', stiffness: 320, damping: 18}}
        className='bg-primary mx-auto flex h-20 w-20 items-center justify-center rounded-full'
        aria-hidden
      >
        <Tick01Icon
          size={40}
          strokeWidth={2.5}
          className='text-white'
        />
      </m.div>

      <m.div
        initial={reducedMotion ? false : {opacity: 0, y: 12}}
        animate={{opacity: 1, y: 0}}
        transition={reducedMotion ? {duration: 0} : {delay: 0.15, duration: 0.35, ease: 'easeOut'}}
      >
        <h1 className='text-2xl font-black'>All caught up!</h1>
        <p className='text-muted-foreground mt-2'>No vocabulary due for review right now.</p>
      </m.div>

      <m.div
        initial={reducedMotion ? false : {opacity: 0, y: 12}}
        animate={{opacity: 1, y: 0}}
        transition={reducedMotion ? {duration: 0} : {delay: 0.3, duration: 0.35, ease: 'easeOut'}}
      >
        <Button onClick={onBack}>Back to map</Button>
      </m.div>
    </div>
  )
}
