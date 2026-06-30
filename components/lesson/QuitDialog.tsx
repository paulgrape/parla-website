'use client'

import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'

interface QuitDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function QuitDialog({ open, onCancel, onConfirm }: QuitDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-50 flex items-center justify-center p-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type='button'
            aria-label='Close'
            onClick={onCancel}
            className='absolute inset-0 bg-background/70 backdrop-blur-sm'
          />
          <motion.div
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className='relative z-10 w-full max-w-sm rounded-3xl border-2 border-border bg-card p-6 text-center'
          >
            <h3 className='text-2xl font-black font-display'>
              Quit this level?
            </h3>
            <p className='mt-2 text-sm font-bold text-muted-foreground'>
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
