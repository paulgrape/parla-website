'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {usePathname} from 'next/navigation'

export function PageFade({children}: {children: React.ReactNode}) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  return (
    <div
      key={pathname}
      className={cn('min-h-full', !reducedMotion && 'animate-page-fade')}
    >
      {children}
    </div>
  )
}
