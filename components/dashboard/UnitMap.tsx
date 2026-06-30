'use client'

import { cn } from '@/lib/utils'
import type { Lesson, Unit } from '@llp/types'
import { LockIcon, StarIcon, Tick01Icon } from 'hugeicons-react'
import Link from 'next/link'

interface UnitMapProps {
  units: (Unit & { lessons: Lesson[] })[]
  completedLessons: string[]
}

// Horizontal offsets (px) cycled per node to form a Duolingo-style wave path.
const WAVE_OFFSETS = [0, -60, -100, -60, 0, 60, 100, 60]

// Banner color cycled per unit so consecutive chapters feel distinct.
const UNIT_THEMES = [
  { banner: 'bg-primary', shadow: '#46a302' },
  { banner: 'bg-purple-500', shadow: '#7c3aed' },
  { banner: 'bg-sky-500', shadow: '#0284c7' },
  { banner: 'bg-orange-500', shadow: '#c2410c' },
  { banner: 'bg-pink-500', shadow: '#be185d' },
]

export function UnitMap({ units, completedLessons }: UnitMapProps) {
  const allLessons = units.flatMap(u =>
    u.lessons.map(l => ({ ...l, unitOrder: u.order })),
  )

  const isUnlocked = (lessonId: string, index: number) => {
    if (index === 0) return true
    const prev = allLessons[index - 1]
    return completedLessons.includes(prev.id)
  }

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
              className='sticky md:top-4 top-18'
              style={{ zIndex: 10 + unitIndex }}
            >
              <div
                aria-hidden
                className='pointer-events-none absolute inset-x-0 bottom-full h-18 bg-background md:h-4'
              />
              <div
                className={cn(
                  'relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)]',
                  theme.banner,
                )}
              >
                <div>
                  <p className='text-xs font-black uppercase tracking-wide text-white/80'>
                    Section 1, Unit {unit.order}
                  </p>
                  <h2 className='text-lg font-black font-display md:text-xl'>
                    {unit.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-center gap-4 pt-8'>
              {unit.lessons.map((lesson, lessonIndex) => {
                const globalIndex = allLessons.findIndex(
                  l => l.id === lesson.id,
                )
                const completed = completedLessons.includes(lesson.id)
                const unlocked = isUnlocked(lesson.id, globalIndex)
                const offset = WAVE_OFFSETS[lessonIndex % WAVE_OFFSETS.length]

                return (
                  <div
                    key={lesson.id}
                    className='flex flex-col items-center'
                    style={{ marginLeft: offset }}
                  >
                    <Link
                      href={unlocked ? `/lesson/${lesson.id}` : '#'}
                      aria-disabled={!unlocked}
                      onClick={e => !unlocked && e.preventDefault()}
                      className={cn(
                        'flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold transition-all duration-100 md:h-18 md:w-18',
                        completed
                          ? 'border-primary-dark bg-primary text-white shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                          : unlocked
                            ? 'border-primary-dark bg-card text-primary shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                            : 'cursor-not-allowed border-border bg-muted text-muted-foreground shadow-[0_8px_0_0_var(--shadow-raised)]',
                      )}
                    >
                      {completed ? (
                        <Tick01Icon
                          size={30}
                          strokeWidth={2.5}
                        />
                      ) : unlocked ? (
                        <StarIcon
                          size={26}
                          strokeWidth={2}
                        />
                      ) : (
                        <LockIcon
                          size={22}
                          strokeWidth={2}
                        />
                      )}
                    </Link>
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
