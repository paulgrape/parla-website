'use client'

import {Card} from '@/components/ui/card'
import {Progress} from '@/components/ui/progress'
import {useCountUp} from '@/hooks/useCountUp'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {xpInCurrentLevel, xpToLevel} from '@/lib/xp'

interface XpBarProps {
  xp: number
  level?: number
}

export function XpBar({xp, level = xpToLevel(xp)}: XpBarProps) {
  const displayXp = useCountUp(xp, {durationMs: 600})
  const xpInLevel = xpInCurrentLevel(xp)
  const reducedMotion = useReducedMotion()
  const celebrate = !reducedMotion && displayXp !== xp

  return (
    <Card
      data-testid='xp-bar'
      className={cn(celebrate && 'animate-xp-glow')}
    >
      <div className='mb-2 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm font-bold uppercase'>XP Level {level}</p>
        <p className={cn('text-primary text-sm font-bold', celebrate && 'animate-xp-tick')}>{displayXp} XP</p>
      </div>
      <Progress value={xpInLevel} />
      <p className='text-muted-foreground mt-2 text-xs'>
        {100 - xpInLevel} XP to reach level {level + 1}
      </p>
    </Card>
  )
}
