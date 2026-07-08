'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {type HTMLMotionProps, m} from 'framer-motion'

interface SlideUpProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  delay?: number
  distance?: number
}

export function SlideUp({children, className, delay = 0, distance = 16, ...props}: SlideUpProps) {
  const reducedMotion = useReducedMotion()

  return (
    <m.div
      initial={reducedMotion ? false : {opacity: 0, y: distance}}
      animate={{opacity: 1, y: 0}}
      transition={reducedMotion ? {duration: 0} : {duration: 0.35, delay, ease: 'easeOut'}}
      className={cn(className)}
      {...props}
    >
      {children}
    </m.div>
  )
}
