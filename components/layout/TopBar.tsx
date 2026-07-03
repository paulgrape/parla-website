'use client'

import { ThemedUserButton } from '@/components/auth/ThemedUserButton'
import { AppLogo } from '@/components/layout/AppLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useUserStats } from '@/components/providers/UserStatsProvider'
import { FavouriteIcon, FireIcon } from 'hugeicons-react'
import { usePathname } from 'next/navigation'

export function TopBar() {
  const pathname = usePathname()
  const { stats } = useUserStats()

  // Desktop has no top navbar; immersive lesson flow hides it on mobile too.
  if (pathname.startsWith('/lesson/')) return null

  const streak = stats?.streak ?? 0
  const extendedToday = stats?.extendedToday ?? false
  const streakColor = extendedToday ? 'text-orange-500' : 'text-muted-foreground'
  const hearts = stats?.hearts ?? stats?.maxHearts ?? 5

  return (
    <header className='sticky top-0 z-30 flex items-center justify-between border-b-2 border-border bg-card px-4 py-3 md:hidden'>
      <AppLogo size='sm' />
      <div className='flex items-center gap-4'>
        <div
          className='flex items-center gap-1'
          aria-label={`${hearts} hearts`}
        >
          <FavouriteIcon
            size={20}
            strokeWidth={2}
            className='text-destructive'
            aria-hidden
          />
          <span className='font-bold text-destructive'>{hearts}</span>
        </div>
        <div
          className='flex items-center gap-1'
          aria-label={`${streak} day streak${extendedToday ? ', extended today' : ''}`}
        >
          <FireIcon
            size={20}
            strokeWidth={2}
            className={streakColor}
            aria-hidden
          />
          <span className={`font-bold ${streakColor}`}>{streak}</span>
        </div>
        <ThemeToggle />
        <ThemedUserButton afterSignOutUrl='/sign-in' />
      </div>
    </header>
  )
}
