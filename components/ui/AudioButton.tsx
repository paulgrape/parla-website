'use client'

import {speakItalian} from '@/lib/speech'
import {cn} from '@/lib/utils'
import {VolumeHighIcon} from 'hugeicons-react'

interface AudioButtonProps {
  text: string
  label?: string
  className?: string
}

export function AudioButton({text, label, className}: AudioButtonProps) {
  return (
    <button
      type='button'
      onClick={() => speakItalian(text)}
      aria-label={label ?? `Play audio: ${text}`}
      className={cn(
        'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
    >
      <VolumeHighIcon
        size={20}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  )
}
