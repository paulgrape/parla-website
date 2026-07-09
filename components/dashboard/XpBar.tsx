'use client'

import {TextSkeleton, ValueSkeleton} from '@/components/skeletons/UserStatsSkeletons'
import {Card} from '@/components/ui/card'
import {Progress} from '@/components/ui/progress'
import {Skeleton} from '@/components/ui/skeleton'
import {useCountUp} from '@/hooks/useCountUp'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {xpInCurrentLevel, xpToLevel} from '@/lib/xp'

interface XpBarProps {
  xp: number
  level?: number
  pending?: boolean
}

export function XpBar({xp, level = xpToLevel(xp), pending = false}: XpBarProps) {
  const displayXp = useCountUp(pending ? 0 : xp, {durationMs: 600})
  const xpInLevel = xpInCurrentLevel(xp)
  const reducedMotion = useReducedMotion()
  const celebrate = !pending && !reducedMotion && displayXp !== xp

  return (
    <Card
      data-testid='xp-bar'
      className={cn(celebrate && 'animate-xp-glow')}
    >
      <div className='mb-2 flex items-center justify-between'>
        <p className='text-muted-foreground text-sm font-bold uppercase'>
          XP Level {pending ? <ValueSkeleton className='inline-block h-4 w-5 align-middle' /> : level}
        </p>
        {pending ? (
          <ValueSkeleton className='h-4 w-14' />
        ) : (
          <p className={cn('text-primary text-sm font-bold', celebrate && 'animate-xp-tick')}>{displayXp} XP</p>
        )}
      </div>
      {pending ? <Skeleton className='h-2 w-full rounded-full' /> : <Progress value={xpInLevel} />}
      {pending ? (
        <TextSkeleton className='mt-2 h-3 w-40' />
      ) : (
        <p className='text-muted-foreground mt-2 text-xs'>
          {100 - xpInLevel} XP to reach level {level + 1}
        </p>
      )}
    </Card>
  )
}
