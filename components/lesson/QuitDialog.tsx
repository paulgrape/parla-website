'use client'

import {Button} from '@/components/ui/button'
import {Dialog} from '@/components/ui/dialog'
import {MotionDialogPanel} from '@/components/ui/motion'
import {AnimatePresence} from 'framer-motion'
import {useId} from 'react'

interface QuitDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function QuitDialog({open, onCancel, onConfirm}: QuitDialogProps) {
  const titleId = useId()
  const descriptionId = useId()

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
          <MotionDialogPanel className='border-border bg-card w-full max-w-sm rounded-3xl border-2 p-6 text-center'>
            <h3
              id={titleId}
              className='font-display text-2xl font-black'
            >
              Quit this level?
            </h3>
            <p
              id={descriptionId}
              className='text-muted-foreground mt-2 text-sm font-bold'
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
          </MotionDialogPanel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
