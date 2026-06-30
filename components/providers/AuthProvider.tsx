'use client'

import { useClerkAppearance } from '@/hooks/useClerkAppearance'
import { ClerkProvider } from '@clerk/nextjs'

function hasValidClerkKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return Boolean(key && key.startsWith('pk_') && !key.includes('placeholder'))
}

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const appearance = useClerkAppearance()

  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey()) {
    return <>{children}</>
  }

  return <ClerkWithTheme>{children}</ClerkWithTheme>
}
