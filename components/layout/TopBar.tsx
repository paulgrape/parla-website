'use client'

import {AppLogo} from '@/components/layout/AppLogo'
import {UserMenu} from '@/components/layout/UserMenu'
import {useUserStats} from '@/components/providers/UserStatsProvider'
import {
  StatsLoadingStatus,
  ValueSkeleton,
  pendingIconClass,
  useStatsPending
} from '@/components/skeletons/UserStatsSkeletons'
import {cn} from '@/lib/utils'
import {FavouriteIcon, FireIcon} from 'hugeicons-react'
import {usePathname} from 'next/navigation'

export function TopBar() {
  const pathname = usePathname()
  const {stats} = useUserStats()
  const statsPending = useStatsPending()

  // Desktop has no top navbar; immersive lesson flow hides it on mobile too.
  if (pathname.startsWith('/lesson/')) return null

  const streak = stats?.streak ?? 0
  const extendedToday = stats?.extendedToday ?? false
  const streakColor = extendedToday ? 'text-orange-500' : 'text-muted-foreground'
  const hearts = stats?.hearts ?? stats?.maxHearts ?? 5

  return (
    <header className='border-border bg-card sticky top-0 z-30 flex items-center justify-between border-b-2 px-4 py-3 md:hidden'>
      <AppLogo size='sm' />
      <StatsLoadingStatus
        label='Loading stats'
        pending={statsPending}
        className='flex items-center gap-4'
      >
        <div
          className='flex items-center gap-1'
          aria-label={statsPending ? undefined : `${hearts} hearts`}
        >
          <FavouriteIcon
            size={20}
            strokeWidth={2}
            className={cn('text-destructive', pendingIconClass(statsPending))}
            aria-hidden
          />
          {statsPending ? (
            <ValueSkeleton className='h-5 w-5' />
          ) : (
            <span className='text-destructive font-bold'>{hearts}</span>
          )}
        </div>
        <div
          className='flex items-center gap-1'
          aria-label={statsPending ? undefined : `${streak} day streak${extendedToday ? ', extended today' : ''}`}
        >
          <FireIcon
            size={20}
            strokeWidth={2}
            className={cn(streakColor, pendingIconClass(statsPending))}
            aria-hidden
          />
          {statsPending ? (
            <ValueSkeleton className='h-5 w-5' />
          ) : (
            <span className={`font-bold ${streakColor}`}>{streak}</span>
          )}
        </div>
        <UserMenu variant='compact' />
      </StatsLoadingStatus>
    </header>
  )
}
