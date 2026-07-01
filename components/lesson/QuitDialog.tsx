'use client'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { AnimatePresence, motion } from 'framer-motion'
import { useId } from 'react'

interface QuitDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function QuitDialog({ open, onCancel, onConfirm }: QuitDialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          titleId={titleId}
          descriptionId={descriptionId}
          onClose={onCancel}
          closeOnBackdrop
          backdropLabel='Keep learning'
        >
          <motion.div
            initial={reducedMotion ? false : { scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { scale: 0.92, y: 12 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 28 }
            }
            className='w-full max-w-sm rounded-3xl border-2 border-border bg-card p-6 text-center'
          >
            <h3
              id={titleId}
              className='text-2xl font-black font-display'
            >
              Quit this level?
            </h3>
            <p
              id={descriptionId}
              className='mt-2 text-sm font-bold text-muted-foreground'
            >
              You&apos;ll lose your progress for this level.
            </p>
            <div className='mt-6 flex flex-col gap-3'>
              <Button
                onClick={onCancel}
                size='lg'
                className='w-full'
              >
                Keep learning
              </Button>
              <Button
                onClick={onConfirm}
                size='lg'
                variant='destructive'
                className='w-full'
              >
                Quit
              </Button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
