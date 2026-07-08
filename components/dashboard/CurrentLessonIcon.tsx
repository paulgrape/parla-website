'use client'

import {useState} from 'react'

const ROTATION_PER_BOUNCE_DEG = 72

interface CurrentLessonIconProps {
  animate: boolean
  children: React.ReactNode
}

export function CurrentLessonIcon({animate, children}: CurrentLessonIconProps) {
  const [baseRotation, setBaseRotation] = useState(0)

  if (!animate) {
    return <span className='inline-flex'>{children}</span>
  }

  return (
    <span
      className='animate-node-icon-bounce inline-flex'
      data-testid='current-lesson-icon'
    >
      <span
        className='inline-flex'
        style={{transform: `rotate(${baseRotation}deg)`}}
      >
        <span
          className='animate-node-icon-spin inline-flex'
          aria-hidden
          onAnimationIteration={() => setBaseRotation(current => current + ROTATION_PER_BOUNCE_DEG)}
        >
          {children}
        </span>
      </span>
    </span>
  )
}
