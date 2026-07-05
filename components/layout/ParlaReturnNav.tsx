'use client'

import { AppLogo } from '@/components/layout/AppLogo'
import { useParlaReturnNav } from '@/hooks/useParlaReturnNav'
import { APP_NAME } from '@/lib/constants'
import { ArrowLeft01Icon } from 'hugeicons-react'
import Link from 'next/link'

const linkClassName =
  'inline-flex items-center gap-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1'

export function ParlaReturnNavFallback() {
  return (
    <>
      <Link href='/sign-in' className={linkClassName}>
        Go to {APP_NAME}
      </Link>
      <AppLogo size='md' href='/sign-in' />
    </>
  )
}

export function ParlaReturnNav() {
  const nav = useParlaReturnNav()

  return (
    <>
      <Link href={nav.href} className={linkClassName}>
        {nav.mode === 'back' && (
          <ArrowLeft01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
        )}
        {nav.label}
      </Link>
      <AppLogo size='md' href={nav.href} />
    </>
  )
}
