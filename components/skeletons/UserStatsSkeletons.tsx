'use client'

import {useUserStats} from '@/components/providers/UserStatsProvider'
import {Skeleton} from '@/components/ui/skeleton'
import {cn} from '@/lib/utils'

export function useStatsPending() {
  const {stats, loading} = useUserStats()
  return loading && !stats
}

export function pendingIconClass(pending?: boolean) {
  return pending ? 'animate-pulse' : undefined
}

export function ValueSkeleton({className}: {className?: string}) {
  return <Skeleton className={cn('inline-block h-5 w-6', className)} />
}

export function TextSkeleton({className}: {className?: string}) {
  return <Skeleton className={cn('h-4 w-28', className)} />
}

export function AvatarPlaceholder({size, className}: {size: number; className?: string}) {
  return (
    <div
      aria-hidden
      style={{width: size, height: size}}
      className={cn('border-border bg-muted shrink-0 animate-pulse rounded-full border-2', className)}
    />
  )
}

export function StatsLoadingStatus({
  label,
  children,
  pending,
  className
}: {
  label: string
  children: React.ReactNode
  pending?: boolean
  className?: string
}) {
  if (!pending) return children

  return (
    <div
      role='status'
      aria-busy='true'
      className={className}
    >
      <span className='sr-only'>{label}</span>
      {children}
    </div>
  )
}
