'use client'

import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {AnimatePresence, m} from 'framer-motion'
import {Alert02Icon, Cancel01Icon, Tick01Icon} from 'hugeicons-react'
import {type ReactNode, createContext, useCallback, useContext, useId, useMemo, useState} from 'react'

type ToastVariant = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-primary bg-primary/10 text-primary',
  error: 'border-destructive bg-destructive/10 text-destructive',
  info: 'border-border bg-card text-foreground'
}

export function ToastProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<ToastItem[]>([])
  const reducedMotion = useReducedMotion()
  const regionId = useId()

  const dismiss = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setItems(current => [...current, {id, message, variant}])
      window.setTimeout(() => dismiss(id), 3200)
    },
    [dismiss]
  )

  const value = useMemo(() => ({toast}), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        id={regionId}
        className='pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-6'
        aria-live='polite'
        aria-relevant='additions'
      >
        <AnimatePresence>
          {items.map(item => (
            <m.div
              key={item.id}
              role={item.variant === 'error' ? 'alert' : 'status'}
              initial={reducedMotion ? false : {opacity: 0, y: 12, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={reducedMotion ? undefined : {opacity: 0, y: 8, scale: 0.96}}
              transition={reducedMotion ? {duration: 0} : {duration: 0.22, ease: 'easeOut'}}
              className={cn(
                'pointer-events-auto flex max-w-sm items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold shadow-lg',
                VARIANT_STYLES[item.variant]
              )}
              data-testid='toast'
            >
              {item.variant === 'success' ? (
                <Tick01Icon
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden
                />
              ) : item.variant === 'error' ? (
                <Alert02Icon
                  size={18}
                  strokeWidth={2.5}
                  aria-hidden
                />
              ) : null}
              <span className='flex-1'>{item.message}</span>
              <button
                type='button'
                aria-label='Dismiss notification'
                onClick={() => dismiss(item.id)}
                className='hover:bg-background/40 focus-visible:ring-primary -mr-1 rounded-full p-1 focus-visible:ring-2 focus-visible:outline-none'
              >
                <Cancel01Icon
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden
                />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
