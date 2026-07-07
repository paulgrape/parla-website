'use client'

import {GlobalErrorView} from '@/components/errors/GlobalErrorView'
import {APP_NAME} from '@/lib/constants'
import {useEffect} from 'react'

import './globals.css'

export default function GlobalError({
  error,
  unstable_retry
}: {
  error: Error & {digest?: string}
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang='en'>
      <title>{`Something went wrong — ${APP_NAME}`}</title>
      <body className='bg-muted text-foreground'>
        <GlobalErrorView
          digest={error.digest}
          onRetry={() => unstable_retry()}
        />
      </body>
    </html>
  )
}
