import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted p-4'>
      <div className='w-full max-w-md text-center'>
        <h1 className='text-4xl font-black text-primary'>Terms of Service</h1>
        <p className='mt-4 text-muted-foreground'>
          Full terms of service content is coming soon.
        </p>
        <Link
          href='/sign-in'
          className='mt-6 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
