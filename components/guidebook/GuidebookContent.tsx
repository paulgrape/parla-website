'use client'

import { GuidebookSkeleton } from '@/components/skeletons/PageSkeletons'
import { AudioButton } from '@/components/ui/AudioButton'
import { Markdown } from '@/components/ui/Markdown'
import { useApi } from '@/lib/api'
import type { Guidebook } from '@llp/types'
import { ArrowLeft01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function GuidebookContent({ unitId }: { unitId: string }) {
  const { fetchApi } = useApi()
  const [guidebook, setGuidebook] = useState<Guidebook | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApi<Guidebook>(`/guidebook/${unitId}`)
      .then(setGuidebook)
      .catch(() => setError('Could not load guidebook.'))
      .finally(() => setLoading(false))
  }, [fetchApi, unitId])

  if (loading) {
    return <GuidebookSkeleton />
  }

  if (error || !guidebook) {
    return (
      <div className='rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center'>
        <p className='font-bold text-destructive'>
          {error ?? 'Guidebook not found.'}
        </p>
        <Link
          href='/dashboard'
          className='mt-4 inline-block text-sm font-bold text-primary'
        >
          Back to learn
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <Link
        href='/dashboard'
        className='inline-flex items-center gap-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1'
      >
        <ArrowLeft01Icon
          size={18}
          strokeWidth={2}
          aria-hidden
        />
        Back
      </Link>

      <header>
        <h1 className='text-2xl font-black font-display md:text-3xl'>
          {guidebook.unitTitle} Guidebook
        </h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          Explore grammar tips and key phrases for this unit.
        </p>
      </header>

      {guidebook.phrases.length > 0 && (
        <section aria-labelledby='phrases-heading'>
          <h2
            id='phrases-heading'
            className='mb-4 text-sm font-black uppercase tracking-wide text-primary'
          >
            Key phrases
          </h2>
          <ul className='space-y-3'>
            {guidebook.phrases.map(phrase => (
              <li
                key={phrase.order}
                className='flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-4'
              >
                <AudioButton
                  text={phrase.audioText ?? phrase.italian}
                />
                <div>
                  <p className='font-bold text-foreground'>
                    {phrase.italian}
                  </p>
                  <p className='mt-0.5 text-sm text-muted-foreground'>
                    {phrase.english}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guidebook.grammarTips && (
        <section aria-labelledby='grammar-heading'>
          <h2
            id='grammar-heading'
            className='mb-4 text-sm font-black uppercase tracking-wide text-primary'
          >
            Grammar tips
          </h2>
          <div className='rounded-2xl border-2 border-border bg-card p-5'>
            <Markdown>{guidebook.grammarTips}</Markdown>
          </div>
        </section>
      )}
    </div>
  )
}
