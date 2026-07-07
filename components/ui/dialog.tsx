'use client'

import {useDialogA11y} from '@/hooks/useDialogA11y'
import {cn} from '@/lib/utils'
import {useSyncExternalStore} from 'react'
import {createPortal} from 'react-dom'

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

interface DialogProps {
  open: boolean
  titleId: string
  descriptionId?: string
  onClose?: () => void
  closeOnEscape?: boolean
  closeOnBackdrop?: boolean
  backdropLabel?: string
  variant?: 'centered' | 'bottom'
  ariaLive?: 'polite' | 'assertive' | 'off'
  className?: string
  panelClassName?: string
  backdropClassName?: string
  children: React.ReactNode
}

export function Dialog({
  open,
  titleId,
  descriptionId,
  onClose,
  closeOnEscape = true,
  closeOnBackdrop = false,
  backdropLabel = 'Dismiss dialog',
  variant = 'centered',
  ariaLive,
  className,
  panelClassName,
  backdropClassName,
  children
}: DialogProps) {
  const panelRef = useDialogA11y({open, onClose, closeOnEscape})
  const isClient = useIsClient()

  if (!open || !isClient) return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50',
        variant === 'bottom' ? 'flex items-end justify-center' : 'flex items-center justify-center p-6',
        className
      )}
    >
      {closeOnBackdrop && onClose && (
        <button
          type='button'
          aria-label={backdropLabel}
          onClick={onClose}
          className={cn('bg-background/70 absolute inset-0 backdrop-blur-sm', backdropClassName)}
        />
      )}
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-live={ariaLive}
        tabIndex={-1}
        className={cn('relative z-10 outline-none', variant === 'bottom' && 'w-full max-w-lg', panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
