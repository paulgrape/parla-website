'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {m} from 'framer-motion'
import {Tick01Icon} from 'hugeicons-react'
import Link from 'next/link'

interface SectionCompleteBannerProps {
  sectionTitle?: string
}

export function SectionCompleteBanner({sectionTitle}: SectionCompleteBannerProps) {
  const reducedMotion = useReducedMotion()

  return (
    <m.div
      initial={reducedMotion ? false : {opacity: 0, y: 20, scale: 0.96}}
      animate={{opacity: 1, y: 0, scale: 1}}
      transition={reducedMotion ? {duration: 0} : {type: 'spring', stiffness: 260, damping: 22}}
      className='border-border bg-card space-y-4 rounded-2xl border-2 p-6 text-center'
    >
      <m.div
        initial={reducedMotion ? false : {scale: 0}}
        animate={{scale: 1}}
        transition={reducedMotion ? {duration: 0} : {type: 'spring', delay: 0.15, stiffness: 320, damping: 18}}
        className='bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full'
        aria-hidden
      >
        <Tick01Icon
          size={32}
          strokeWidth={2.5}
          className='text-white'
        />
      </m.div>

      <div>
        <p className='text-primary text-sm font-black uppercase'>Section complete!</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          {sectionTitle ? `You finished all lessons in ${sectionTitle}.` : 'You finished every lesson in this section.'}
        </p>
      </div>

      <Link
        href='/sections'
        className={cn(
          'focus-visible:ring-primary inline-block rounded-xl px-5 py-2.5 text-sm font-black tracking-wide uppercase transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'bg-primary text-primary-foreground shadow-[0_4px_0_0_#46a302] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#46a302]'
        )}
      >
        View sections
      </Link>
    </m.div>
  )
}
