'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {type HTMLMotionProps, m} from 'framer-motion'

type MotionDialogVariant = 'centered' | 'bottom'

interface MotionDialogPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: MotionDialogVariant
  children: React.ReactNode
}

const CENTERED = {
  initial: {opacity: 0, scale: 0.92, y: 12},
  animate: {opacity: 1, scale: 1, y: 0},
  exit: {opacity: 0, scale: 0.92, y: 12},
  transition: {type: 'spring' as const, stiffness: 320, damping: 28}
}

const BOTTOM = {
  initial: {y: '100%'},
  animate: {y: 0},
  exit: {y: '100%'},
  transition: {type: 'spring' as const, stiffness: 320, damping: 32}
}

export function MotionDialogPanel({variant = 'centered', className, children, ...props}: MotionDialogPanelProps) {
  const reducedMotion = useReducedMotion()
  const preset = variant === 'bottom' ? BOTTOM : CENTERED

  return (
    <m.div
      initial={reducedMotion ? false : preset.initial}
      animate={preset.animate}
      exit={reducedMotion ? undefined : preset.exit}
      transition={reducedMotion ? {duration: 0} : preset.transition}
      className={cn(className)}
      {...props}
    >
      {children}
    </m.div>
  )
}
