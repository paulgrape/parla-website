'use client'

import {Button, buttonVariants} from '@/components/ui/button'
import {APP_NAME} from '@/lib/constants'
import {AlertCircleIcon} from 'hugeicons-react'
import Link from 'next/link'

import {StatusPageShell} from './StatusPageShell'

interface RouteErrorViewProps {
  digest?: string
  onRetry?: () => void
}

export function RouteErrorView({digest, onRetry = () => {}}: RouteErrorViewProps) {
  return (
    <StatusPageShell>
      <AlertCircleIcon
        size={56}
        strokeWidth={2}
        className='text-destructive mx-auto'
        aria-hidden
      />

      <div className='space-y-2'>
        <h1 className='font-display text-foreground text-2xl font-black'>Something went wrong</h1>
        <p className='text-muted-foreground leading-relaxed'>
          An unexpected error happened. You can try again, or head back to where things are working.
        </p>
        {digest ? <p className='text-muted-foreground pt-1 font-mono text-xs'>Error ID: {digest}</p> : null}
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
            className: 'w-full'
          })}
        >
          Back to {APP_NAME}
        </Link>
      </div>
    </StatusPageShell>
  )
}
