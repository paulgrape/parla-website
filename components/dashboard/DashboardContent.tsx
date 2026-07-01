'use client'

import { UnitMap } from '@/components/dashboard/UnitMap'
import { useUserStats } from '@/components/providers/UserStatsProvider'
import { useApi } from '@/lib/api'
import type { Lesson, Unit } from '@llp/types'
import { useEffect, useState } from 'react'

function formatCountdown(ms: number) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }
  return `${totalMinutes} min`
}

export function DashboardContent() {
  const { fetchApi } = useApi()
  const { stats } = useUserStats()
  const [units, setUnits] = useState<(Unit & { lessons: Lesson[] })[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    fetchApi<Unit[]>('/units')
      .then(allUnits => {
        setUnits(
          allUnits.map(unit => ({
            ...unit,
            lessons: unit.lessons ?? [],
          })),
        )
      })
      .catch(() => {
        setError(
          'Could not load your learning path. Make sure the API is running (npm run dev:api).',
        )
      })
      .finally(() => setLoading(false))
  }, [fetchApi])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <p
        role='status'
        aria-live='polite'
        className='text-center text-muted-foreground py-12'
      >
        Loading your path...
      </p>
    )
  }

  if (error) {
    return (
      <div className='rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center'>
        <p className='font-bold text-destructive'>{error}</p>
      </div>
    )
  }

  const hearts = stats?.hearts ?? stats?.maxHearts ?? 5
  const heartsAvailable = hearts > 0
  const nextHeartAt = stats?.nextHeartAt ?? null
  const regenLabel =
    nextHeartAt && nextHeartAt > now ? formatCountdown(nextHeartAt - now) : null

  return (
    <div className='space-y-8'>
      <h1 className='sr-only'>Learning path</h1>
      {!heartsAvailable && (
        <div className='rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 text-center'>
          <p className='font-black text-destructive'>
            You&apos;re out of hearts
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            {regenLabel
              ? `Your next heart arrives in ${regenLabel}. Levels unlock once you have at least one.`
              : 'Levels unlock once you have at least one heart.'}
          </p>
        </div>
      )}

      {units.length === 0 ? (
        <div className='rounded-2xl border-2 border-border bg-muted p-6 text-center'>
          <p className='font-bold'>No levels found</p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Run <code className='rounded bg-card px-1'>npm run db:seed</code> to
            populate the curriculum.
          </p>
        </div>
      ) : (
        <UnitMap
          units={units}
          completedLessons={stats?.completedLessons ?? []}
          heartsAvailable={heartsAvailable}
        />
      )}
    </div>
  )
}
