'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import { AlertCircleIcon } from 'hugeicons-react'
import Link from 'next/link'
import { StatusPageShell } from './StatusPageShell'

interface RouteErrorViewProps {
  digest?: string
  onRetry?: () => void
}

export function RouteErrorView({
  digest,
  onRetry = () => {},
}: RouteErrorViewProps) {
  return (
    <StatusPageShell>
      <AlertCircleIcon
        size={56}
        strokeWidth={2}
        className='mx-auto text-destructive'
        aria-hidden
      />

      <div className='space-y-2'>
        <h1 className='text-2xl font-black font-display text-foreground'>
          Something went wrong
        </h1>
        <p className='leading-relaxed text-muted-foreground'>
          An unexpected error happened. You can try again, or head back to
          where things are working.
        </p>
        {digest ? (
          <p className='pt-1 font-mono text-xs text-muted-foreground'>
            Error ID: {digest}
          </p>
        ) : null}
      </div>

      <div className='space-y-3'>
        <Button
          type='button'
          onClick={onRetry}
          className='w-full'
        >
          Try again
        </Button>
        <Link
          href='/'
          className={buttonVariants({
            variant: 'outline',
            className: 'w-full',
          })}
        >
          Back to {APP_NAME}
        </Link>
      </div>
    </StatusPageShell>
  )
}
