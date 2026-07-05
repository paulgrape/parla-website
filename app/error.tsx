'use client'

import { RouteErrorView } from '@/components/errors/RouteErrorView'
import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteErrorView
      digest={error.digest}
      onRetry={() => unstable_retry()}
    />
  )
}
