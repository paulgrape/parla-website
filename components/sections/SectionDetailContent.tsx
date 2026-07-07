'use client'

import {SectionDetailSkeleton} from '@/components/skeletons/PageSkeletons'
import {AccordionItem} from '@/components/ui/Accordion'
import {AudioButton} from '@/components/ui/AudioButton'
import {Markdown} from '@/components/ui/Markdown'
import {useApi} from '@/lib/api'
import {cn} from '@/lib/utils'
import type {Section} from '@llp/types'
import {ArrowLeft01Icon, BookOpen01Icon, ChartBarLineIcon} from 'hugeicons-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'

const SECTION_THEMES = ['bg-primary', 'bg-sky-500', 'bg-purple-500', 'bg-orange-500']

export function SectionDetailContent({sectionId}: {sectionId: string}) {
  const {fetchApi} = useApi()
  const [section, setSection] = useState<Section | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi<Section>(`/sections/${sectionId}`)
      .then(setSection)
      .catch(() => setError('Could not load section details.'))
      .finally(() => setLoading(false))
  }, [fetchApi, sectionId])

  if (loading) {
    return <SectionDetailSkeleton />
  }

  if (error || !section) {
    return (
      <div className='border-destructive/30 bg-destructive/5 rounded-2xl border-2 p-6 text-center'>
        <p className='text-destructive font-bold'>{error ?? 'Section not found.'}</p>
        <Link
          href='/sections'
          className='text-primary mt-4 inline-block text-sm font-bold'
        >
          Back to sections
        </Link>
      </div>
    )
  }

  const theme = SECTION_THEMES[(section.order - 1) % SECTION_THEMES.length]

  return (
    <div className='space-y-6'>
      <Link
        href='/sections'
        className='text-muted-foreground hover:text-foreground focus-visible:ring-primary inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      >
        <ArrowLeft01Icon
          size={18}
          strokeWidth={2}
          aria-hidden
        />
        Sections
      </Link>

      <h1 className='sr-only'>{section.title} details</h1>

      <div className={cn('rounded-2xl px-5 py-6 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)]', theme)}>
        <p className='text-xs font-black tracking-wide text-white/80 uppercase'>
          {section.cefrLevel} &bull; See details
        </p>
        <h2 className='font-display mt-1 text-2xl font-black'>{section.title}</h2>
        <p className='mt-2 text-sm text-white/90'>{section.description}</p>
      </div>

      <section aria-labelledby='cefr-heading'>
        <div className='mb-3 flex items-center gap-2'>
          <ChartBarLineIcon
            size={22}
            strokeWidth={2}
            className='text-primary'
            aria-hidden
          />
          <h2
            id='cefr-heading'
            className='text-lg font-black'
          >
            CEFR {section.cefrLevel}
          </h2>
        </div>
        <p className='text-muted-foreground text-sm leading-relaxed'>{section.cefrDescription}</p>

        <div className='border-border bg-muted mt-4 flex items-start gap-3 rounded-2xl border-2 p-4'>
          <AudioButton text={section.exampleSentence} />
          <div>
            <p className='text-foreground font-bold'>{section.exampleSentence}</p>
            <p className='text-muted-foreground mt-1 text-sm'>{section.exampleTranslation}</p>
          </div>
        </div>
      </section>

      {section.grammarConcepts.length > 0 && (
        <section aria-labelledby='grammar-heading'>
          <div className='mb-3 flex items-center gap-2'>
            <BookOpen01Icon
              size={22}
              strokeWidth={2}
              className='text-primary'
              aria-hidden
            />
            <h2
              id='grammar-heading'
              className='text-lg font-black'
            >
              Grammar concepts
            </h2>
          </div>

          <div className='border-border bg-card rounded-2xl border-2 px-4'>
            {section.grammarConcepts.map((concept, i) => (
              <AccordionItem
                key={concept.title}
                title={concept.title}
                defaultOpen={i === 0}
              >
                <Markdown>{concept.content}</Markdown>
              </AccordionItem>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
