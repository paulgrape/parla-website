import {GlobalErrorView} from '@/components/errors/GlobalErrorView'
import {RouteErrorView} from '@/components/errors/RouteErrorView'
import {cn} from '@/lib/utils'
import type {Metadata} from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Error page preview',
  robots: {index: false, follow: false}
}

const previewLinks = [
  {href: '/test-errors?global=false', label: 'Route error', global: 'false'},
  {href: '/test-errors?global=true', label: 'Global error', global: 'true'}
] as const

export default async function TestErrorsPage({searchParams}: {searchParams: Promise<{global?: string}>}) {
  const {global} = await searchParams
  const isGlobal = global === 'true'

  return (
    <>
      <div className='border-border bg-card/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm'>
        <div className='mx-auto flex max-w-md items-center justify-center gap-2 p-3'>
          {previewLinks.map(({href, label, global: globalValue}) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'focus-visible:ring-primary rounded-xl px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                (global ?? 'false') === globalValue
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {isGlobal ? (
        <div className='pt-14'>
          <GlobalErrorView digest='preview-digest-abc123' />
        </div>
      ) : (
        <div className='pt-14'>
          <RouteErrorView digest='preview-digest-abc123' />
        </div>
      )}
    </>
  )
}
