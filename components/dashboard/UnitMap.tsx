'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'
import type { Lesson, Unit } from '@llp/types'
import { BookOpen01Icon, LockIcon, StarIcon, Tick01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'

interface UnitMapProps {
  units: (Unit & { lessons: Lesson[] })[]
  completedLessons: string[]
  heartsAvailable?: boolean
  sectionOrder?: number
}

const WAVE_OFFSETS = [0, -60, -100, -60, 0, 60, 100, 60]

const UNIT_THEMES = [
  { banner: 'bg-primary', shadow: '#46a302' },
  { banner: 'bg-purple-500', shadow: '#7c3aed' },
  { banner: 'bg-sky-500', shadow: '#0284c7' },
  { banner: 'bg-orange-500', shadow: '#c2410c' },
  { banner: 'bg-pink-500', shadow: '#be185d' },
]

export function UnitMap({
  units,
  completedLessons,
  heartsAvailable = true,
  sectionOrder = 1,
}: UnitMapProps) {
  const reducedMotion = useReducedMotion()
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const allLessons = useMemo(
    () =>
      units.flatMap(u => u.lessons.map(l => ({ ...l, unitOrder: u.order }))),
    [units],
  )

  const isUnlocked = (lessonId: string, index: number) => {
    if (index === 0) return true
    const prev = allLessons[index - 1]
    return completedLessons.includes(prev.id)
  }

  const nextLessonId = useMemo(() => {
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i]
      const unlocked =
        i === 0 || completedLessons.includes(allLessons[i - 1].id)
      if (!completedLessons.includes(lesson.id) && unlocked) {
        return lesson.id
      }
    }
    return null
  }, [allLessons, completedLessons])

  useEffect(() => {
    if (!nextLessonId) return
    const el = nodeRefs.current.get(nextLessonId)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const viewportMid = window.innerHeight / 2
    const elMid = rect.top + rect.height / 2
    const alreadyCentered = Math.abs(elMid - viewportMid) < 80

    if (!alreadyCentered) {
      el.scrollIntoView({
        block: 'center',
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }
  }, [nextLessonId, reducedMotion])

  return (
    <div className='space-y-8'>
      {units.map((unit, unitIndex) => {
        const theme = UNIT_THEMES[unitIndex % UNIT_THEMES.length]

        return (
          <section
            key={unit.id}
            className='space-y-0'
          >
            <div
              className='sticky md:top-4 top-20'
              style={{ zIndex: 10 + unitIndex }}
            >
              <div
                aria-hidden
                className='pointer-events-none absolute inset-x-0 bottom-full h-8 bg-background md:h-4'
              />
              <div
                className={cn(
                  'relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)]',
                  theme.banner,
                )}
              >
                <div>
                  <p className='text-xs font-black uppercase tracking-wide text-white/80'>
                    Section {sectionOrder}, Unit {unit.order}
                  </p>
                  <h2 className='text-lg font-black font-display md:text-xl'>
                    {unit.title}
                  </h2>
                </div>
                <Link
                  href={`/guidebook/${unit.id}`}
                  className='flex shrink-0 items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
                >
                  <BookOpen01Icon
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                  />
                  Guidebook
                </Link>
              </div>
            </div>

            <div className='flex flex-col items-center gap-4 pt-8'>
              {unit.lessons.map((lesson, lessonIndex) => {
                const globalIndex = allLessons.findIndex(
                  l => l.id === lesson.id,
                )
                const completed = completedLessons.includes(lesson.id)
                const unlocked = isUnlocked(lesson.id, globalIndex)
                const canOpen = unlocked && heartsAvailable
                const isNext = lesson.id === nextLessonId
                const offset = WAVE_OFFSETS[lessonIndex % WAVE_OFFSETS.length]
                const lessonLabel = `Level ${lesson.order}: ${lesson.title}${
                  completed
                    ? ', completed'
                    : !unlocked
                      ? ', locked'
                      : !heartsAvailable
                        ? ', no hearts'
                        : isNext
                          ? ', current'
                          : ''
                }`

                const nodeClassName = cn(
                  'flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold transition-all duration-100 md:h-18 md:w-18',
                  completed
                    ? 'border-primary-dark bg-primary text-white shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                    : unlocked
                      ? 'border-primary-dark bg-card text-primary shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                      : 'cursor-not-allowed border-border bg-muted text-muted-foreground shadow-[0_8px_0_0_var(--shadow-raised)]',
                  unlocked &&
                    !heartsAvailable &&
                    'cursor-not-allowed opacity-60',
                )

                const nodeIcon = completed ? (
                  <Tick01Icon
                    size={30}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : unlocked ? (
                  <StarIcon
                    size={26}
                    strokeWidth={2}
                    aria-hidden
                  />
                ) : (
                  <LockIcon
                    size={22}
                    strokeWidth={2}
                    aria-hidden
                  />
                )

                return (
                  <div
                    key={lesson.id}
                    ref={el => {
                      if (el) nodeRefs.current.set(lesson.id, el)
                    }}
                    className='flex flex-col items-center'
                    style={{ marginLeft: offset }}
                  >
                    {canOpen ? (
                      <Link
                        href={`/lesson/${lesson.id}`}
                        aria-label={lessonLabel}
                        aria-current={isNext ? 'step' : undefined}
                        className={nodeClassName}
                      >
                        {nodeIcon}
                      </Link>
                    ) : (
                      <span
                        role='img'
                        aria-label={lessonLabel}
                        className={nodeClassName}
                      >
                        {nodeIcon}
                      </span>
                    )}
                    <p
                      className={cn(
                        'mt-3 max-w-32 text-center text-sm font-bold',
                        unlocked ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      Level {lesson.order}: {lesson.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
