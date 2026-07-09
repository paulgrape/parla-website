'use client'

import {StreakCard} from '@/components/dashboard/StreakCard'
import {XpBar} from '@/components/dashboard/XpBar'
import {LegalLinks} from '@/components/layout/LegalLinks'
import {useUserStats} from '@/components/providers/UserStatsProvider'
import {
  StatsLoadingStatus,
  ValueSkeleton,
  pendingIconClass,
  useStatsPending
} from '@/components/skeletons/UserStatsSkeletons'
import {cn} from '@/lib/utils'
import {FavouriteIcon, FireIcon, StarIcon} from 'hugeicons-react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

function formatCountdown(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }
  return `${totalMinutes}m`
}

export function RightAside() {
  const pathname = usePathname()
  const {stats} = useUserStats()
  const statsPending = useStatsPending()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  // Immersive lesson flow: hide the aside while inside a lesson.
  if (pathname.startsWith('/lesson/')) return null

  const streak = stats?.streak ?? 0
  const extendedToday = stats?.extendedToday ?? false
  const longestStreak = stats?.longestStreak ?? 0
  const xp = stats?.xp ?? 0
  const nextReview = stats?.nextReview ?? 0
  const maxHearts = stats?.maxHearts ?? 5
  const hearts = stats?.hearts ?? maxHearts
  const nextHeartAt = stats?.nextHeartAt ?? null
  const regenHint =
    !statsPending && nextHeartAt && hearts < maxHearts ? `+1 in ${formatCountdown(nextHeartAt - now)}` : null

  return (
    <aside className='border-border bg-card sticky top-0 hidden h-screen w-92 shrink-0 flex-col gap-5 overflow-y-auto border-l-2 p-6 lg:flex'>
      <StatsLoadingStatus
        label='Loading stats'
        pending={statsPending}
        className='space-y-5'
      >
        <div className='border-border flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3'>
          <div
            className={cn(
              'flex items-center gap-1.5 font-black',
              extendedToday ? 'text-orange-500' : 'text-muted-foreground'
            )}
          >
            <FireIcon
              size={22}
              strokeWidth={2.5}
              className={pendingIconClass(statsPending)}
            />
            {statsPending ? <ValueSkeleton className='h-6 w-8' /> : streak}
          </div>
          <div className='text-primary flex items-center gap-1.5 font-black'>
            <StarIcon
              size={22}
              strokeWidth={2.5}
              className={pendingIconClass(statsPending)}
            />
            {statsPending ? <ValueSkeleton className='h-6 w-10' /> : xp}
          </div>
          <div className='text-destructive flex items-center gap-1.5 font-black'>
            <FavouriteIcon
              size={22}
              strokeWidth={2.5}
              className={pendingIconClass(statsPending)}
            />
            {statsPending ? <ValueSkeleton className='h-6 w-6' /> : hearts}
          </div>
        </div>

        {regenHint && (
          <p className='text-muted-foreground -mt-3 text-center text-xs font-bold'>Next heart {regenHint}</p>
        )}

        <StreakCard
          streak={streak}
          longestStreak={longestStreak}
          active={extendedToday}
          pending={statsPending}
        />
        <XpBar
          xp={xp}
          pending={statsPending}
        />

        {!statsPending && nextReview > 0 && (
          <Link
            href='/review'
            className='border-primary bg-primary/5 hover:bg-primary/10 rounded-3xl border-2 p-4 transition-colors'
          >
            <p className='text-primary font-bold'>
              {nextReview} word{nextReview !== 1 ? 's' : ''} ready for review
            </p>
            <p className='text-muted-foreground text-sm'>Tap to start a review session</p>
          </Link>
        )}
      </StatsLoadingStatus>

      <LegalLinks
        variant='aside'
        className='px-2'
      />
    </aside>
  )
}
