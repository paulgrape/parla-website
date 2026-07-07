'use client'

import {cn} from '@/lib/utils'
import {ArrowDown01Icon} from 'hugeicons-react'
import {useId, useState} from 'react'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({title, children, defaultOpen = false}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className='border-border border-b-2 last:border-b-0'>
      <button
        type='button'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(prev => !prev)}
        className='text-foreground hover:text-primary focus-visible:ring-primary flex w-full items-center justify-between gap-4 py-4 text-left font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      >
        {title}
        <ArrowDown01Icon
          size={20}
          strokeWidth={2}
          aria-hidden
          className={cn('text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div
          id={panelId}
          role='region'
          className='pb-4'
        >
          {children}
        </div>
      )}
    </div>
  )
}
