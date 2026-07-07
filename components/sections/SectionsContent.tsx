'use client'

import {SectionsSkeleton} from '@/components/skeletons/PageSkeletons'
import {Progress} from '@/components/ui/progress'
import {useApi} from '@/lib/api'
import {isSectionComplete, isSectionUnlocked} from '@/lib/sections'
import {cn} from '@/lib/utils'
import type {Section} from '@llp/types'
import {ArrowLeft01Icon, LockIcon, Tick01Icon} from 'hugeicons-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'

const SECTION_THEMES = [
  {card: 'bg-primary', shadow: '#46a302'},
  {card: 'bg-sky-500', shadow: '#0284c7'},
  {card: 'bg-purple-500', shadow: '#7c3aed'},
  {card: 'bg-orange-500', shadow: '#c2410c'}
]

export function SectionsContent() {
  const {fetchApi} = useApi()
  const [sections, setSections] = useState<Section[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi<Section[]>('/sections')
      .then(setSections)
      .catch(() => setError('Could not load sections.'))
      .finally(() => setLoading(false))
  }, [fetchApi])

  if (loading) {
    return <SectionsSkeleton />
  }

  if (error) {
    return (
      <div className='border-destructive/30 bg-destructive/5 rounded-2xl border-2 p-6 text-center'>
        <p className='text-destructive font-bold'>{error}</p>
      </div>
    )
  }

  const activeSectionIndex = sections.findIndex(s => !isSectionComplete(s))

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Link
          href='/dashboard'
          className='text-muted-foreground hover:text-foreground focus-visible:ring-primary flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
        >
          <ArrowLeft01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
          Back
        </Link>
      </div>

      <h1 className='sr-only'>Sections</h1>

      <div className='space-y-4'>
        {sections.map((section, index) => {
          const theme = SECTION_THEMES[index % SECTION_THEMES.length]
          const lessonCount = section.lessonCount ?? 0
          const completedCount = section.completedCount ?? 0
          const isComplete = isSectionComplete(section)
          const isUnlocked = isSectionUnlocked(sections, index)
          const isLocked = !isComplete && !isUnlocked
          const isActive = index === activeSectionIndex
          const progressPct = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0

          return (
            <article
              key={section.id}
              className={cn('border-border bg-card overflow-hidden rounded-2xl border-2', isLocked && 'opacity-60')}
            >
              <div
                className={cn('relative px-5 py-4 text-white', theme.card)}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255,255,255,0.04) 10px, rgba(255,255,255,0.04) 20px)'
                }}
              >
                <Link
                  href={`/sections/details/${section.id}`}
                  className='rounded text-xs font-black tracking-wide text-white/80 uppercase hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none'
                >
                  {section.cefrLevel} &bull; See details
                </Link>
                <h2 className='font-display mt-1 text-xl font-black'>{section.title}</h2>
              </div>

              <div className='flex items-center justify-between gap-4 p-5'>
                <div className='flex-1 space-y-2'>
                  {isComplete ? (
                    <p className='text-primary flex items-center gap-2 text-sm font-black uppercase'>
                      <Tick01Icon
                        size={18}
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      Completed!
                    </p>
                  ) : isLocked ? (
                    <p className='text-muted-foreground flex items-center gap-2 text-sm font-bold'>
                      <LockIcon
                        size={16}
                        strokeWidth={2}
                        aria-hidden
                      />
                      Complete previous sections
                    </p>
                  ) : isActive ? (
                    <div className='space-y-1'>
                      <Progress
                        value={progressPct}
                        className='h-3'
                      />
                      <p className='text-muted-foreground text-xs font-bold'>{progressPct}% complete</p>
                    </div>
                  ) : (
                    <p className='text-muted-foreground text-sm font-bold'>
                      {completedCount}/{lessonCount} lessons
                    </p>
                  )}
                </div>

                {isLocked ? (
                  <span
                    aria-disabled
                    className='border-border bg-muted text-muted-foreground shrink-0 cursor-not-allowed rounded-xl border-2 px-5 py-2.5 text-sm font-black tracking-wide uppercase'
                  >
                    Locked
                  </span>
                ) : (
                  <Link
                    href={`/dashboard?sectionId=${section.id}`}
                    className={cn(
                      'focus-visible:ring-primary shrink-0 rounded-xl px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      isActive && !isComplete
                        ? 'bg-primary text-primary-foreground shadow-[0_4px_0_0_#46a302] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#46a302]'
                        : 'border-border bg-card text-foreground border-2'
                    )}
                  >
                    {isComplete ? 'Review' : isActive ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
