'use client'

import {AppLogo} from '@/components/layout/AppLogo'

interface GlobalErrorViewProps {
  digest?: string
  onRetry?: () => void
}

export function GlobalErrorView({digest, onRetry = () => {}}: GlobalErrorViewProps) {
  return (
    <main className='bg-muted flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='border-border bg-card space-y-6 rounded-3xl border-2 p-6 text-center'>
          <AppLogo
            size='lg'
            href={false}
            className='mx-auto w-fit'
          />

          <div className='space-y-2'>
            <h1 className='font-display text-foreground text-2xl font-black'>Something went wrong</h1>
            <p className='text-muted-foreground leading-relaxed'>
              A critical error occurred while loading the app. Please try again.
            </p>
            {digest ? <p className='text-muted-foreground pt-1 font-mono text-xs'>Error ID: {digest}</p> : null}
          </div>

          <button
            type='button'
            onClick={onRetry}
            className='bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold tracking-wide uppercase shadow-[0_4px_0_0_#46a302] transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-1 active:shadow-none'
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  )
}
