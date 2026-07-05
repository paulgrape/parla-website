'use client'

import { APP_NAME } from '@/lib/constants'
import { getReferrerPath, isSafeInternalPath } from '@/lib/parlaReturnNav'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export type ParlaReturnNavState = {
  mode: 'back' | 'go'
  href: string
  label: string
}

function parseFromParam(from: string | null): string | null {
  if (!from) return null

  try {
    const decoded = decodeURIComponent(from)
    return isSafeInternalPath(decoded) ? decoded : null
  } catch {
    return null
  }
}

export function useParlaReturnNav(): ParlaReturnNavState {
  const searchParams = useSearchParams()
  const { isSignedIn, isLoaded } = useAuth()

  const returnPath = useMemo(() => {
    const fromPath = parseFromParam(searchParams.get('from'))
    if (fromPath) return fromPath
    return getReferrerPath()
  }, [searchParams])

  if (returnPath) {
    return {
      mode: 'back',
      href: returnPath,
      label: `Back to ${APP_NAME}`,
    }
  }

  if (!isLoaded) {
    return {
      mode: 'go',
      href: '/sign-in',
      label: `Go to ${APP_NAME}`,
    }
  }

  return {
    mode: 'go',
    href: isSignedIn ? '/' : '/sign-in',
    label: `Go to ${APP_NAME}`,
  }
}
