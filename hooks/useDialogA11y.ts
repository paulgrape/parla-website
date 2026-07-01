'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(el => el.offsetParent !== null || el === document.activeElement)
}

interface UseDialogA11yOptions {
  open: boolean
  onClose?: () => void
  closeOnEscape?: boolean
}

export function useDialogA11y({
  open,
  onClose,
  closeOnEscape = true,
}: UseDialogA11yOptions) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null

    const appShell = document.getElementById('app-shell')
    appShell?.setAttribute('inert', '')

    requestAnimationFrame(() => {
      const panel = panelRef.current
      if (!panel) return
      const focusables = getFocusableElements(panel)
      ;(focusables[0] ?? panel).focus()
    })

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && closeOnEscape && onClose) {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusables = getFocusableElements(panel)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      appShell?.removeAttribute('inert')
      previouslyFocusedRef.current?.focus()
    }
  }, [open, onClose, closeOnEscape])

  return panelRef
}
