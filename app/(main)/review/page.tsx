'use client'

import {ReviewSkeleton} from '@/components/skeletons/PageSkeletons'
import {Button} from '@/components/ui/button'
import {useApi} from '@/lib/api'
import {cn} from '@/lib/utils'
import type {ReviewItem} from '@llp/types'
import {useEffect, useState} from 'react'

export default function ReviewPage() {
  const {fetchApi} = useApi()
  const [items, setItems] = useState<ReviewItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

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

  const submitQuality = async (quality: number) => {
    if (!current) return

    await fetchApi(`/review/${current.id}`, {
      method: 'POST',
      body: JSON.stringify({quality})
    })

    if (currentIndex + 1 >= items.length) {
      setDone(true)
    } else {
      setCurrentIndex(i => i + 1)
      setFlipped(false)
    }
  }

  if (loading) {
    return <ReviewSkeleton />
  }

  if (done) {
    return (
      <div className='mx-auto max-w-md space-y-4 py-20 text-center'>
        <h1 className='text-2xl font-black'>All caught up!</h1>
        <p className='text-muted-foreground'>No vocabulary due for review right now.</p>
        <Button onClick={() => (window.location.href = '/dashboard')}>Back to map</Button>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-lg space-y-6'>
      <div>
        <h1 className='text-2xl font-black'>Vocabulary Review</h1>
        <p className='text-muted-foreground'>
          Card {currentIndex + 1} of {items.length}
        </p>
      </div>

      <button
        type='button'
        onClick={() => setFlipped(!flipped)}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `Showing English: ${current.english}. Press to show Italian.`
            : `Showing Italian: ${current.italian}. Press to show English.`
        }
        className={cn(
          'border-border bg-card focus-visible:ring-primary flex min-h-[200px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 p-6 text-left transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          flipped && 'bg-primary/5 border-primary'
        )}
      >
        <p className='text-muted-foreground mb-2 text-sm font-bold uppercase'>{flipped ? 'English' : 'Italian'}</p>
        <p className='text-3xl font-black'>{flipped ? current.english : current.italian}</p>
        <p className='text-muted-foreground mt-4 text-xs'>Tap or press to flip</p>
      </button>

      {flipped && (
        <div
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
              onClick={() => submitQuality(quality)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
