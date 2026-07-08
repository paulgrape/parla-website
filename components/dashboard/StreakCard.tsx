'use client'

import {Card} from '@/components/ui/card'
import {useCountUp} from '@/hooks/useCountUp'
import {FireIcon} from 'hugeicons-react'

interface StreakCardProps {
  streak: number
  longestStreak: number
  active?: boolean
}

export function StreakCard({streak, longestStreak, active = true}: StreakCardProps) {
  const displayStreak = useCountUp(streak)

  if (!active) {
    return (
      <Card className='border-border'>
        <div className='flex items-center gap-4'>
          <div className='bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl'>
            <FireIcon
              size={32}
              strokeWidth={2}
              className='text-muted-foreground'
            />
          </div>
          <div>
            <p className='text-muted-foreground text-sm font-bold uppercase'>Current Streak</p>
            <p className='text-muted-foreground text-4xl font-black'>{displayStreak}</p>
            <p className='text-muted-foreground text-xs'>Best: {longestStreak} days</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className='border-orange-200'>
      <div className='flex items-center gap-4'>
        <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500'>
          <FireIcon
            size={32}
            strokeWidth={2}
            className='text-white'
          />
        </div>
        <div>
          <p className='text-sm font-bold text-orange-700 uppercase dark:text-orange-400'>Current Streak</p>
          <p className='text-4xl font-black text-orange-500 dark:text-orange-400'>{displayStreak}</p>
          <p className='text-xs text-orange-600 dark:text-orange-500/90'>Best: {longestStreak} days</p>
        </div>
      </div>
    </Card>
  )
}
