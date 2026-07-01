'use client'

import { UnitMap } from '@/components/dashboard/UnitMap'
import { DashboardSkeleton } from '@/components/skeletons/PageSkeletons'
import { useUserStats } from '@/components/providers/UserStatsProvider'
import { useApi } from '@/lib/api'
import type { Lesson, Section, Unit } from '@llp/types'
import { ArrowLeft01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const sectionIdParam = searchParams.get('sectionId')

  const [units, setUnits] = useState<(Unit & { lessons: Lesson[] })[]>([])
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    fetchApi<Section[]>('/sections')
      .then(allSections => {
        const target =
          (sectionIdParam
            ? allSections.find(s => s.id === sectionIdParam)
            : null) ??
          allSections.find(
            s => (s.completedCount ?? 0) < (s.lessonCount ?? 0),
          ) ??
          allSections[allSections.length - 1] ??
          null

        setActiveSection(target)

        if (target) {
          return fetchApi<Unit[]>(`/units?sectionId=${target.id}`).then(
            allUnits => {
              setUnits(
                allUnits.map(unit => ({
                  ...unit,
                  lessons: unit.lessons ?? [],
                })),
              )
            },
          )
        }
      })
      .catch(() => {
        setError(
          'Could not load your learning path. Make sure the API is running (npm run dev:api).',
        )
      })
      .finally(() => setLoading(false))
  }, [fetchApi, sectionIdParam])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  if (loading) {
    return <DashboardSkeleton />
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
      <div className='flex items-center justify-between gap-4'>
        <h1 className='sr-only'>Learning path</h1>
        <Link
          href='/sections'
          className='inline-flex items-center gap-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1'
        >
          <ArrowLeft01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
          Sections
        </Link>
        {activeSection && (
          <p className='text-sm font-bold text-muted-foreground'>
            {activeSection.title}
          </p>
        )}
      </div>

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
          sectionOrder={activeSection?.order ?? 1}
        />
      )}
    </div>
  )
}
