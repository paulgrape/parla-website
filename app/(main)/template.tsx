'use client'

import {PageFade} from '@/components/layout/PageFade'

export default function MainTemplate({children}: {children: React.ReactNode}) {
  return <PageFade>{children}</PageFade>
}
