'use client'

import {ReviewComplete} from '@/components/review/ReviewComplete'
import {REVIEW_CARD_EXIT_MS, ReviewFlashcard} from '@/components/review/ReviewFlashcard'
import {ReviewSkeleton} from '@/components/skeletons/PageSkeletons'
import {Button} from '@/components/ui/button'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {useApi} from '@/lib/api'
import type {ReviewItem} from '@llp/types'
import {AnimatePresence, m} from 'framer-motion'
import {useEffect, useState} from 'react'

export default function ReviewPage() {
  const {fetchApi} = useApi()
  const reducedMotion = useReducedMotion()
  const [items, setItems] = useState<ReviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApi<ReviewItem[]>('/review')
      .then(data => {
        setItems(data)
        setDone(data.length === 0)
      })
      .catch(() => setDone(true))
      .finally(() => setLoading(false))
  }, [fetchApi])

  const current = items[currentIndex]

  const advanceAfterSubmit = () => {
    const exitMs = reducedMotion ? 0 : REVIEW_CARD_EXIT_MS

    window.setTimeout(() => {
      if (currentIndex + 1 >= items.length) {
        setDone(true)
      } else {
        setCurrentIndex(i => i + 1)
        setFlipped(false)
      }
      setExiting(false)
      setSubmitting(false)
    }, exitMs)
  }

  const submitQuality = async (quality: number) => {
    if (!current || submitting) return

    setSubmitting(true)
    setExiting(true)

    try {
      await fetchApi(`/review/${current.id}`, {
        method: 'POST',
        body: JSON.stringify({quality})
      })
    } catch {
      setExiting(false)
      setSubmitting(false)
      return
    }

    advanceAfterSubmit()
  }

  if (loading) {
    return <ReviewSkeleton />
  }

  if (done) {
    return <ReviewComplete onBack={() => (window.location.href = '/dashboard')} />
  }

  return (
    <div className='mx-auto max-w-lg space-y-6'>
      <div>
        <h1 className='text-2xl font-black'>Vocabulary Review</h1>
        <p className='text-muted-foreground'>
          Card {currentIndex + 1} of {items.length}
        </p>
      </div>

      <AnimatePresence mode='wait'>
        <ReviewFlashcard
          key={current.id}
          item={current}
          flipped={flipped}
          exiting={exiting}
          onFlip={() => !submitting && setFlipped(open => !open)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {flipped && !exiting && (
          <m.div
            initial={reducedMotion ? false : {opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={reducedMotion ? undefined : {opacity: 0, y: 8}}
            transition={{duration: reducedMotion ? 0 : 0.25}}
            className='grid grid-cols-3 gap-2'
            role='group'
            aria-label='Rate how well you remembered this word'
          >
            {[
              {label: 'Hard', quality: 1},
              {label: 'Good', quality: 3},
              {label: 'Easy', quality: 5}
            ].map(({label, quality}) => (
              <Button
                key={quality}
                variant={quality === 5 ? 'default' : 'outline'}
                disabled={submitting}
                onClick={() => submitQuality(quality)}
              >
                {label}
              </Button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
