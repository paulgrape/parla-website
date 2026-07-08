'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {m} from 'framer-motion'
import {FireIcon} from 'hugeicons-react'
import Link from 'next/link'

interface StreakAtRiskBannerProps {
  streak: number
}

export function StreakAtRiskBanner({streak}: StreakAtRiskBannerProps) {
  const reducedMotion = useReducedMotion()

  return (
    <m.div
      data-testid='streak-at-risk'
      initial={reducedMotion ? false : {opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={reducedMotion ? {duration: 0} : {duration: 0.3, ease: 'easeOut'}}
      className='space-y-3 rounded-2xl border-2 border-orange-300/60 bg-orange-500/10 p-4'
      role='status'
    >
      <div className='flex items-start gap-3'>
        <m.div
          animate={reducedMotion ? undefined : {scale: [1, 1.12, 1]}}
          transition={reducedMotion ? undefined : {duration: 1.4, repeat: Infinity, ease: 'easeInOut'}}
          className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500'
          aria-hidden
        >
          <FireIcon
            size={24}
            strokeWidth={2}
            className='text-white'
            fill='currentColor'
          />
        </m.div>
        <div className='min-w-0'>
          <p className='font-black text-orange-700 dark:text-orange-400'>Streak at risk</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            Your {streak}-day streak needs a lesson today. Keep the fire going.
          </p>
        </div>
      </div>
      <Link
        href='/sections'
        className={cn(
          'focus-visible:ring-primary inline-flex rounded-xl px-4 py-2 text-sm font-black tracking-wide uppercase transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'bg-orange-500 text-white shadow-[0_4px_0_0_#c2410c] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#c2410c]'
        )}
      >
        Practice now
      </Link>
    </m.div>
  )
}
