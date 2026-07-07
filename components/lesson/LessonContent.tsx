'use client'

import {LessonEngine} from '@/components/lesson/LessonEngine'
import {LessonSkeleton} from '@/components/skeletons/PageSkeletons'
import {Button} from '@/components/ui/button'
import {useApi} from '@/lib/api'
import type {Exercise} from '@llp/types'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'

interface LessonContentProps {
  lessonId: string
}

export function LessonContent({lessonId}: LessonContentProps) {
  const router = useRouter()
  const {fetchApi} = useApi()
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApi<Exercise[]>(`/lessons/${lessonId}/exercises`)
      .then(setExercises)
      .catch(() => {
        setError('Could not load this level. Make sure the API is running (npm run dev:api).')
      })
  }, [fetchApi, lessonId])

  if (error) {
    return (
      <div className='mx-auto max-w-md space-y-4 py-20 text-center'>
        <p className='text-destructive font-bold'>{error}</p>
        <Button onClick={() => router.push('/dashboard')}>Back to map</Button>
      </div>
    )
  }

  if (!exercises) {
    return <LessonSkeleton />
  }

  if (exercises.length === 0) {
    return (
      <div className='mx-auto max-w-md space-y-4 py-20 text-center'>
        <p className='font-bold'>This level has no exercises yet.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to map</Button>
      </div>
    )
  }

  return (
    <LessonEngine
      lessonId={lessonId}
      exercises={exercises}
    />
  )
}
