import {buttonVariants} from '@/components/ui/button'
import {APP_NAME} from '@/lib/constants'
import Link from 'next/link'

import {StatusPageShell} from './StatusPageShell'

export function NotFoundView() {
  return (
    <StatusPageShell>
      <p
        className='font-display text-primary text-7xl font-black'
        aria-hidden
      >
        404
      </p>

      <div className='space-y-2'>
        <h1 className='font-display text-foreground text-2xl font-black'>Page not found</h1>
        <p className='text-muted-foreground leading-relaxed'>
          Ci dispiace &mdash; this page took a wrong turn. It may have been moved or never existed.
        </p>
      </div>

      <Link
        href='/'
        className={buttonVariants({className: 'w-full'})}
      >
        Back to {APP_NAME}
      </Link>
    </StatusPageShell>
  )
}
