'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'

interface CorrectBurstProps {
  show: boolean
  className?: string
}

const DOTS = [
  {x: 0, y: -18},
  {x: 14, y: -12},
  {x: 18, y: 4},
  {x: 10, y: 16},
  {x: -10, y: 16},
  {x: -18, y: 4},
  {x: -14, y: -12}
]

export function CorrectBurst({show, className}: CorrectBurstProps) {
  const reducedMotion = useReducedMotion()

  if (!show || reducedMotion) return null

  return (
    <span
      className={cn('pointer-events-none absolute inset-0 flex items-center justify-center', className)}
      data-testid='correct-burst'
      aria-hidden
    >
      {DOTS.map((dot, index) => (
        <span
          key={index}
          className='bg-primary animate-correct-burst absolute h-1.5 w-1.5 rounded-full'
          style={
            {
              '--burst-x': `${dot.x}px`,
              '--burst-y': `${dot.y}px`,
              animationDelay: `${index * 18}ms`
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  )
}
