'use client'

import { AppLogo } from '@/components/layout/AppLogo'

interface GlobalErrorViewProps {
  digest?: string
  onRetry?: () => void
}

export function GlobalErrorView({
  digest,
  onRetry = () => {},
}: GlobalErrorViewProps) {
  return (
    <main className='flex min-h-screen items-center justify-center bg-muted p-4'>
      <div className='w-full max-w-md'>
        <div className='space-y-6 rounded-3xl border-2 border-border bg-card p-6 text-center'>
          <AppLogo
            size='lg'
            href={false}
            className='mx-auto w-fit'
          />

          <div className='space-y-2'>
            <h1 className='font-display text-2xl font-black text-foreground'>
              Something went wrong
            </h1>
            <p className='leading-relaxed text-muted-foreground'>
              A critical error occurred while loading the app. Please try again.
            </p>
            {digest ? (
              <p className='pt-1 font-mono text-xs text-muted-foreground'>
                Error ID: {digest}
              </p>
            ) : null}
          </div>

          <button
            type='button'
            onClick={onRetry}
            className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_4px_0_0_#46a302] transition-all hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-1 active:shadow-none'
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  )
}
