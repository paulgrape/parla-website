import { AppLogo } from '@/components/layout/AppLogo'

export default function OfflinePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center'>
      <AppLogo
        size='md'
        showTagline
      />
      <h1 className='text-2xl font-black text-foreground font-display'>
        You&apos;re offline
      </h1>
      <p className='max-w-sm text-muted-foreground'>
        Check your internet connection and try again.
      </p>
    </main>
  )
}
