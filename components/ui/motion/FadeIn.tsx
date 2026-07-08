'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {type HTMLMotionProps, m} from 'framer-motion'

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  delay?: number
  duration?: number
}

export function FadeIn({children, className, delay = 0, duration = 0.28, ...props}: FadeInProps) {
  const reducedMotion = useReducedMotion()

  return (
    <m.div
      initial={reducedMotion ? false : {opacity: 0}}
      animate={{opacity: 1}}
      transition={reducedMotion ? {duration: 0} : {duration, delay, ease: 'easeOut'}}
      className={cn(className)}
      {...props}
    >
      {children}
    </m.div>
  )
}
