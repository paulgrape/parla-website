'use client'

import {Card} from '@/components/ui/card'
import {Progress} from '@/components/ui/progress'

interface XpBarProps {
  xp: number
  level?: number
}

export function XpBar({xp, level = Math.floor(xp / 100) + 1}: XpBarProps) {
  const xpInLevel = xp % 100

  return (
    <Card>
      <div className='mb-2 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm font-bold uppercase'>XP Level {level}</p>
        <p className='text-primary text-sm font-bold'>{xp} XP</p>
      </div>
      <Progress value={xpInLevel} />
      <p className='text-muted-foreground mt-2 text-xs'>
        {100 - xpInLevel} XP to reach level {level + 1}
      </p>
    </Card>
  )
}
