'use client'

import {GuidebookSkeleton} from '@/components/skeletons/PageSkeletons'
import {AudioButton} from '@/components/ui/AudioButton'
import {Markdown} from '@/components/ui/Markdown'
import {useApi} from '@/lib/api'
import type {Guidebook} from '@llp/types'
import {ArrowLeft01Icon} from 'hugeicons-react'
import Link from 'next/link'
import {useEffect, useState} from 'react'

export function GuidebookContent({unitId}: {unitId: string}) {
  const {fetchApi} = useApi()
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
      <div className='border-destructive/30 bg-destructive/5 rounded-2xl border-2 p-6 text-center'>
        <p className='text-destructive font-bold'>{error ?? 'Guidebook not found.'}</p>
        <Link
          href='/dashboard'
          className='text-primary mt-4 inline-block text-sm font-bold'
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
        className='text-muted-foreground hover:text-foreground focus-visible:ring-primary inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      >
        <ArrowLeft01Icon
          size={18}
          strokeWidth={2}
          aria-hidden
        />
        Back
      </Link>

      <header>
        <h1 className='font-display text-2xl font-black md:text-3xl'>{guidebook.unitTitle} Guidebook</h1>
        <p className='text-muted-foreground mt-2 text-sm'>Explore grammar tips and key phrases for this unit.</p>
      </header>

      {guidebook.phrases.length > 0 && (
        <section aria-labelledby='phrases-heading'>
          <h2
            id='phrases-heading'
            className='text-primary mb-4 text-sm font-black tracking-wide uppercase'
          >
            Key phrases
          </h2>
          <ul className='space-y-3'>
            {guidebook.phrases.map(phrase => (
              <li
                key={phrase.order}
                className='border-border bg-card flex items-start gap-3 rounded-2xl border-2 p-4'
              >
                <AudioButton text={phrase.audioText ?? phrase.italian} />
                <div>
                  <p className='text-foreground font-bold'>{phrase.italian}</p>
                  <p className='text-muted-foreground mt-0.5 text-sm'>{phrase.english}</p>
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
            className='text-primary mb-4 text-sm font-black tracking-wide uppercase'
          >
            Grammar tips
          </h2>
          <div className='border-border bg-card rounded-2xl border-2 p-5'>
            <Markdown>{guidebook.grammarTips}</Markdown>
          </div>
        </section>
      )}
    </div>
  )
}
