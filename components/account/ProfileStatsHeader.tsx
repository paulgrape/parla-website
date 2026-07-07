'use client'

import {useUserStats} from '@/components/providers/UserStatsProvider'
import {cn} from '@/lib/utils'
import {useUser} from '@clerk/nextjs'
import {BookOpen01Icon, FireIcon, StarIcon} from 'hugeicons-react'

function formatMemberSince(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

interface ProfileStatsHeaderProps {
  compact?: boolean
}

export function ProfileStatsHeader({compact = false}: ProfileStatsHeaderProps) {
  const {user} = useUser()
  const {stats, loading} = useUserStats()

  const xp = stats?.xp ?? 0
  const level = Math.floor(xp / 100) + 1
  const streak = stats?.streak ?? 0
  const completedCount = stats?.completedLessons.length ?? 0
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Learner'
  const memberSince = user?.createdAt ? formatMemberSince(user.createdAt) : null

  return (
    <div className={cn(compact ? 'space-y-4' : 'space-y-6')}>
      {/* <Card className={cn(compact ? 'space-y-4 p-4' : 'space-y-6')}> */}
      <div
        className={cn(
          'flex items-center gap-3',
          compact ? 'text-left' : 'flex-col gap-4 text-center sm:flex-row sm:text-left'
        )}
      >
        {user?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt=''
            className={cn(
              'border-border shrink-0 rounded-full border-2 object-cover',
              compact ? 'h-14 w-14' : 'h-24 w-24'
            )}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              'border-border bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-full border-2 font-black',
              compact ? 'h-14 w-14 text-xl' : 'h-24 w-24 text-3xl'
            )}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className='min-w-0 flex-1 space-y-0.5'>
          <h2 className={cn('font-display text-foreground truncate font-black', compact ? 'text-lg' : 'text-2xl')}>
            {displayName}
          </h2>
          {user?.username ? <p className='text-muted-foreground truncate text-xs font-bold'>@{user.username}</p> : null}
          {memberSince ? <p className='text-muted-foreground text-xs'>Member since {memberSince}</p> : null}
        </div>
      </div>

      <div
        className={cn('grid grid-cols-3 gap-2', !compact && 'gap-3', loading && 'opacity-60')}
        aria-busy={loading}
      >
        <div
          className={cn(
            'border-border bg-muted/40 rounded-2xl border-2 text-center',
            compact ? 'px-2 py-3' : 'px-3 py-4'
          )}
        >
          <div className='mb-1 flex items-center justify-center gap-1 text-orange-500'>
            <FireIcon
              size={compact ? 14 : 18}
              strokeWidth={2.5}
              aria-hidden
            />
            <span className='text-[10px] font-bold uppercase sm:text-xs'>Streak</span>
          </div>
          <p className={cn('text-foreground font-black', compact ? 'text-xl' : 'text-2xl')}>{streak}</p>
        </div>

        <div
          className={cn(
            'border-border bg-muted/40 rounded-2xl border-2 text-center',
            compact ? 'px-2 py-3' : 'px-3 py-4'
          )}
        >
          <div className='text-primary mb-1 flex items-center justify-center gap-1'>
            <StarIcon
              size={compact ? 14 : 18}
              strokeWidth={2.5}
              aria-hidden
            />
            <span className='text-[10px] font-bold uppercase sm:text-xs'>Level</span>
          </div>
          <p className={cn('text-foreground font-black', compact ? 'text-xl' : 'text-2xl')}>{level}</p>
          <p className='text-muted-foreground text-[10px] sm:text-xs'>{xp} XP</p>
        </div>

        <div
          className={cn(
            'border-border bg-muted/40 rounded-2xl border-2 text-center',
            compact ? 'px-2 py-3' : 'px-3 py-4'
          )}
        >
          <div className='text-muted-foreground mb-1 flex items-center justify-center gap-1'>
            <BookOpen01Icon
              size={compact ? 14 : 18}
              strokeWidth={2.5}
              aria-hidden
            />
            <span className='text-[10px] font-bold uppercase sm:text-xs'>Done</span>
          </div>
          <p className={cn('text-foreground font-black', compact ? 'text-xl' : 'text-2xl')}>{completedCount}</p>
          <p className='text-muted-foreground text-[10px] sm:text-xs'>lessons</p>
        </div>
      </div>
      {/* </Card> */}
    </div>
  )
}
