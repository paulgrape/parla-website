'use client'

import {UnitMap} from '@/components/dashboard/UnitMap'
import {useUserStats} from '@/components/providers/UserStatsProvider'
import {DashboardSkeleton} from '@/components/skeletons/PageSkeletons'
import {useApi} from '@/lib/api'
import {resolveActiveSection} from '@/lib/sections'
import {cn} from '@/lib/utils'
import type {Lesson, Section, Unit} from '@llp/types'
import {Tick01Icon} from 'hugeicons-react'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'

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
  const {fetchApi} = useApi()
  const {stats} = useUserStats()
  const searchParams = useSearchParams()
  const sectionIdParam = searchParams.get('sectionId')

  const [units, setUnits] = useState<(Unit & {lessons: Lesson[]})[]>([])
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    fetchApi<Section[]>('/sections')
      .then(allSections => {
        const target = resolveActiveSection(allSections, sectionIdParam)

        setActiveSection(target)

        if (target) {
          return fetchApi<Unit[]>(`/units?sectionId=${target.id}`).then(allUnits => {
            setUnits(
              allUnits.map(unit => ({
                ...unit,
                lessons: unit.lessons ?? []
              }))
            )
          })
        }
      })
      .catch(() => {
        setError('Could not load your learning path. Make sure the API is running (npm run dev:api).')
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
      <div className='border-destructive/30 bg-destructive/5 rounded-2xl border-2 p-6 text-center'>
        <p className='text-destructive font-bold'>{error}</p>
      </div>
    )
  }

  const hearts = stats?.hearts ?? stats?.maxHearts ?? 5
  const heartsAvailable = hearts > 0
  const nextHeartAt = stats?.nextHeartAt ?? null
  const regenLabel = nextHeartAt && nextHeartAt > now ? formatCountdown(nextHeartAt - now) : null

  const completedLessons = stats?.completedLessons ?? []
  const allLessonIds = units.flatMap(u => u.lessons.map(l => l.id))
  const isSectionComplete = allLessonIds.length > 0 && allLessonIds.every(id => completedLessons.includes(id))

  return (
    <div className='space-y-8'>
      {!heartsAvailable && (
        <div className='border-destructive/30 bg-destructive/5 rounded-2xl border-2 p-4 text-center'>
          <p className='text-destructive font-black'>You&apos;re out of hearts</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            {regenLabel
              ? `Your next heart arrives in ${regenLabel}. Levels unlock once you have at least one.`
              : 'Levels unlock once you have at least one heart.'}
          </p>
        </div>
      )}

      {units.length === 0 ? (
        <div className='border-border bg-muted rounded-2xl border-2 p-6 text-center'>
          <p className='font-bold'>No levels found</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Run <code className='bg-card rounded px-1'>npm run db:seed</code> to populate the curriculum.
          </p>
        </div>
      ) : (
        <>
          <UnitMap
            units={units}
            completedLessons={completedLessons}
            heartsAvailable={heartsAvailable}
            sectionOrder={activeSection?.order ?? 1}
          />

          {isSectionComplete && (
            <div className='border-border bg-card space-y-4 rounded-2xl border-2 p-6 text-center'>
              <p className='text-primary flex items-center justify-center gap-2 text-sm font-black uppercase'>
                <Tick01Icon
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden
                />
                Section complete!
              </p>
              <p className='text-muted-foreground text-sm'>You finished all lessons in {activeSection?.title}.</p>
              <Link
                href='/sections'
                className={cn(
                  'focus-visible:ring-primary inline-block rounded-xl px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'bg-primary text-primary-foreground shadow-[0_4px_0_0_#46a302] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#46a302]'
                )}
              >
                View sections
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
