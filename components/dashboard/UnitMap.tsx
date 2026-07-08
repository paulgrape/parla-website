'use client'

import {CheckFatFillIcon} from '@/components/icons/CheckFatFillIcon'
import {LockKeyFillIcon} from '@/components/icons/LockKeyFillIcon'
import {StarFillIcon} from '@/components/icons/StarFillIcon'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {playSound} from '@/lib/sound'
import {cn} from '@/lib/utils'
import type {Lesson, Unit} from '@llp/types'
// import {LockIcon, StarIcon, Tick01Icon} from 'hugeicons-react'
import {ArrowLeft01Icon, BookOpen01Icon} from 'hugeicons-react'
import Link from 'next/link'
import {useEffect, useMemo, useRef} from 'react'

import {CurrentLessonIcon} from './CurrentLessonIcon'

interface UnitMapProps {
  units: (Unit & {lessons: Lesson[]})[]
  completedLessons: string[]
  heartsAvailable?: boolean
  sectionOrder?: number
}

const WAVE_OFFSETS = [0, -60, -100, -60, 0, 60, 100, 60]

const UNIT_THEMES = [
  {banner: 'bg-primary', shadow: '#46a302'},
  {banner: 'bg-purple-500', shadow: '#7c3aed'},
  {banner: 'bg-sky-500', shadow: '#0284c7'},
  {banner: 'bg-orange-500', shadow: '#c2410c'},
  {banner: 'bg-pink-500', shadow: '#be185d'}
]

export function UnitMap({units, completedLessons, heartsAvailable = true, sectionOrder = 1}: UnitMapProps) {
  const reducedMotion = useReducedMotion()
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const allLessons = useMemo(() => units.flatMap(u => u.lessons.map(l => ({...l, unitOrder: u.order}))), [units])

  const isUnlocked = (lessonId: string, index: number) => {
    if (index === 0) return true
    const prev = allLessons[index - 1]
    return completedLessons.includes(prev.id)
  }

  const nextLessonId = useMemo(() => {
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i]
      const unlocked = i === 0 || completedLessons.includes(allLessons[i - 1].id)
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
        behavior: reducedMotion ? 'auto' : 'smooth'
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
              className='sticky top-20 md:top-4'
              style={{zIndex: 10 + unitIndex}}
            >
              <div
                aria-hidden
                className='bg-background pointer-events-none absolute inset-x-0 bottom-full h-8 md:h-4'
              />
              <div
                className={cn(
                  'relative flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)]',
                  theme.banner
                )}
              >
                <div>
                  <Link
                    href='/sections'
                    className='group text-foreground/80 hover:text-foreground focus-visible:ring-primary my-auto -ml-1 inline-flex items-center gap-1 rounded-lg py-1 pr-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
                  >
                    <ArrowLeft01Icon
                      size={18}
                      strokeWidth={2}
                      aria-hidden
                    />

                    <p className='text-foreground/80 group-hover:text-foreground my-auto text-xs font-black tracking-wide uppercase transition-colors'>
                      Section {sectionOrder}, Unit {unit.order}
                    </p>
                  </Link>
                  <h2 className='font-display text-lg font-black md:text-xl'>{unit.title}</h2>
                </div>
                <Link
                  href={`/guidebook/${unit.id}`}
                  className='flex shrink-0 items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-xs font-black tracking-wide text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none'
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
                const globalIndex = allLessons.findIndex(l => l.id === lesson.id)
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

                const isCurrent = isNext && canOpen && !reducedMotion

                const nodeClassName = cn(
                  'flex h-16 w-[4.5rem] items-center justify-center rounded-[50%] font-bold transition-all duration-100 md:h-16 md:w-18',
                  completed
                    ? 'border-primary-dark bg-primary text-white shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                    : unlocked
                      ? 'border-primary-dark bg-primary text-white shadow-[0_8px_0_0_#46a302] hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
                      : 'cursor-not-allowed border-border bg-muted text-muted-foreground shadow-[0_8px_0_0_var(--shadow-raised)]',
                  unlocked && !heartsAvailable && 'cursor-not-allowed opacity-60'
                )

                const nodeIcon = completed ? (
                  // <Tick01Icon size={30} strokeWidth={2.5} aria-hidden />
                  <CheckFatFillIcon size={28} />
                ) : unlocked ? (
                  // <StarIcon size={26} strokeWidth={2.5} aria-hidden />
                  <StarFillIcon size={30} />
                ) : (
                  // <LockIcon size={26} strokeWidth={2} aria-hidden />
                  <LockKeyFillIcon size={26} />
                )

                const nodeIconContent = <CurrentLessonIcon animate={isCurrent}>{nodeIcon}</CurrentLessonIcon>

                return (
                  <div
                    key={lesson.id}
                    ref={el => {
                      if (el) nodeRefs.current.set(lesson.id, el)
                    }}
                    className='flex flex-col items-center'
                    style={{marginLeft: offset}}
                  >
                    <div className={cn(isCurrent && 'relative')}>
                      {isCurrent && (
                        <span
                          aria-hidden
                          className='border-primary/80 animate-node-ring-pulse pointer-events-none absolute -top-1.5 -right-1.5 -bottom-3.5 -left-1.5 rounded-full border-6'
                        />
                      )}
                      {canOpen ? (
                        <Link
                          href={`/lesson/${lesson.id}`}
                          onClick={() => playSound('click')}
                          aria-label={lessonLabel}
                          aria-current={isNext ? 'step' : undefined}
                          data-testid={isCurrent ? 'current-lesson-node' : undefined}
                          className={nodeClassName}
                        >
                          {nodeIconContent}
                        </Link>
                      ) : (
                        <span
                          role='img'
                          aria-label={lessonLabel}
                          className={nodeClassName}
                        >
                          {nodeIconContent}
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        'mt-6 mb-2 max-w-32 text-center text-sm font-bold',
                        unlocked ? 'text-foreground' : 'text-muted-foreground'
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
