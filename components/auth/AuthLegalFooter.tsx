import Link from 'next/link'

export function AuthLegalFooter() {
  return (
    <footer className='mt-8 text-center text-sm text-muted-foreground'>
      <Link
        href='/terms'
        className='underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
      >
        Terms of Service
      </Link>
      <span aria-hidden='true'> · </span>
      <Link
        href='/privacy'
        className='underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
      >
        Privacy Policy
      </Link>
    </footer>
  )
}
