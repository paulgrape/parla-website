'use client'

import { cn } from '@/lib/utils'
import { FavouriteIcon } from 'hugeicons-react'

interface HeartBarProps {
  lives: number
  maxLives?: number
}

export function HeartBar({ lives, maxLives = 5 }: HeartBarProps) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: maxLives }).map((_, i) => (
        <FavouriteIcon
          key={i}
          size={24}
          strokeWidth={2}
          className={cn(
            'transition-colors',
            i < lives ? 'text-destructive' : 'text-muted',
          )}
          fill={i < lives ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}
