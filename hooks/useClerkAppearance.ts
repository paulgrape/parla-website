'use client'

import { dark } from '@clerk/themes'
import type { Appearance } from '@clerk/types'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'

const brandVariables = {
  colorPrimary: '#58cc02',
  colorDanger: '#ff4b4b',
  borderRadius: '1rem',
} as const

const lightVariables = {
  ...brandVariables,
  colorBackground: '#ffffff',
  colorInputBackground: '#ececec',
  colorText: '#1a1a1a',
  colorTextSecondary: '#777777',
} as const

function buildClerkAppearance(resolvedTheme: string | undefined): Appearance {
  if (resolvedTheme === 'dark') {
    return {
      baseTheme: dark,
      variables: brandVariables,
    }
  }

  return {
    variables: lightVariables,
  }
}

export function useClerkAppearance(): Appearance | undefined {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return useMemo(() => {
    if (!mounted) return undefined
    return buildClerkAppearance(resolvedTheme)
  }, [mounted, resolvedTheme])
}
