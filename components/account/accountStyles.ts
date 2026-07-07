import {cn} from '@/lib/utils'

export const accountInputClassName = cn(
  'w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-medium text-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-60'
)

export const accountPrimaryButtonClassName =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_4px_0_0_#46a302] transition-all hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:translate-y-0 z-10'

export const accountSecondaryButtonClassName =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export const accountDestructiveButtonClassName =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-destructive bg-destructive px-6 text-sm font-bold uppercase tracking-wide text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
