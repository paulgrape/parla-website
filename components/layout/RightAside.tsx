'use client'

import { StreakCard } from '@/components/dashboard/StreakCard'
import { XpBar } from '@/components/dashboard/XpBar'
import { LegalLinks } from '@/components/layout/LegalLinks'
import { useUserStats } from '@/components/providers/UserStatsProvider'
import { FavouriteIcon, FireIcon, StarIcon } from 'hugeicons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  const { stats } = useUserStats()
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
    nextHeartAt && hearts < maxHearts
      ? `+1 in ${formatCountdown(nextHeartAt - now)}`
      : null

  return (
    <aside className='sticky top-0 hidden h-screen w-92 shrink-0 flex-col gap-5 overflow-y-auto border-l-2 border-border bg-card p-6 lg:flex'>
      <div className='flex items-center justify-between gap-2 rounded-2xl border-2 border-border px-4 py-3'>
        <div
          className={`flex items-center gap-1.5 font-black ${
            extendedToday ? 'text-orange-500' : 'text-muted-foreground'
          }`}
        >
          <FireIcon
            size={22}
            strokeWidth={2.5}
          />
          {streak}
        </div>
        <div className='flex items-center gap-1.5 font-black text-primary'>
          <StarIcon
            size={22}
            strokeWidth={2.5}
          />
          {xp}
        </div>
        <div className='flex items-center gap-1.5 font-black text-destructive'>
          <FavouriteIcon
            size={22}
            strokeWidth={2.5}
          />
          {hearts}
        </div>
      </div>

      {regenHint && (
        <p className='-mt-3 text-center text-xs font-bold text-muted-foreground'>
          Next heart {regenHint}
        </p>
      )}

      <StreakCard
        streak={streak}
        longestStreak={longestStreak}
        active={extendedToday}
      />
      <XpBar xp={xp} />

      {nextReview > 0 && (
        <Link
          href='/review'
          className='rounded-3xl border-2 border-primary bg-primary/5 p-4 transition-colors hover:bg-primary/10'
        >
          <p className='font-bold text-primary'>
            {nextReview} word{nextReview !== 1 ? 's' : ''} ready for review
          </p>
          <p className='text-sm text-muted-foreground'>
            Tap to start a review session
          </p>
        </Link>
      )}

      <LegalLinks variant='aside' className='px-2' />
    </aside>
  )
}
