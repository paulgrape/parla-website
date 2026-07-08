'use client'

import {InstallCarousel, type InstallStep} from '@/components/pwa/InstallCarousel'
import {Button} from '@/components/ui/button'
import {Dialog} from '@/components/ui/dialog'
import {MotionDialogPanel} from '@/components/ui/motion'
import {useIOSInstallPrompt} from '@/hooks/useIOSInstallPrompt'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {APP_NAME} from '@/lib/constants'
import {IOS_INSTALL_FORCE_EVENT} from '@/lib/pwa'
import {AnimatePresence, m} from 'framer-motion'
import {Cancel01Icon} from 'hugeicons-react'
import {useEffect, useId, useState} from 'react'

export const INSTALL_STEPS: InstallStep[] = [
  {
    srcLight: '/pwa/step-1-light.svg',
    srcDark: '/pwa/step-1-dark.svg',
    alt: 'Browser toolbar with the three-dots menu button highlighted',
    caption: '1. Tap the ••• menu'
  },
  {
    srcLight: '/pwa/step-2-light.svg',
    srcDark: '/pwa/step-2-dark.svg',
    alt: 'Browser menu with the Share option highlighted',
    caption: '2. Tap Share'
  },
  {
    srcLight: '/pwa/step-3-light.svg',
    srcDark: '/pwa/step-3-dark.svg',
    alt: 'Share sheet for Parla with the View More button highlighted',
    caption: '3. Tap View More'
  },
  {
    srcLight: '/pwa/step-4-light.svg',
    srcDark: '/pwa/step-4-dark.svg',
    alt: 'Share actions list with Add to Home Screen highlighted',
    caption: '4. Tap Add to Home Screen'
  },
  {
    srcLight: '/pwa/step-5-light.svg',
    srcDark: '/pwa/step-5-dark.svg',
    alt: 'Add to Home Screen confirmation for Parla with the Add button highlighted',
    caption: '5. Tap Add'
  }
]

interface IOSInstallSheetProps {
  open: boolean
  onClose: () => void
}

export function IOSInstallSheet({open, onClose}: IOSInstallSheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()

  const handleClose = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          titleId={titleId}
          descriptionId={descriptionId}
          onClose={handleClose}
          closeOnBackdrop
          closeOnEscape
          backdropLabel='Dismiss install tip'
          variant='bottom'
        >
          <MotionDialogPanel
            variant='bottom'
            className='bg-card border-border flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'
          >
            <m.div
              drag={reducedMotion ? false : 'y'}
              dragConstraints={{top: 0, bottom: 0}}
              dragElastic={{top: 0, bottom: 0.4}}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80 || info.velocity.y > 500) handleClose()
              }}
              className='shrink-0 cursor-grab touch-pan-y px-5 pt-3 active:cursor-grabbing'
            >
              <div
                className='bg-border mx-auto h-1.5 w-10 rounded-full'
                aria-hidden
              />
            </m.div>

            <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <h2
                    id={titleId}
                    className='font-display text-foreground text-xl font-bold'
                  >
                    Install {APP_NAME}
                  </h2>
                  <p
                    id={descriptionId}
                    className='text-muted-foreground mt-1 text-sm'
                  >
                    Add to your Home Screen for a faster, full-screen experience.
                  </p>
                </div>

                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  aria-label='Close install tip'
                  onClick={handleClose}
                  className='shrink-0'
                >
                  <Cancel01Icon
                    className='size-5'
                    aria-hidden
                  />
                </Button>
              </div>

              <InstallCarousel steps={INSTALL_STEPS} />

              <Button
                type='button'
                variant='outline'
                className='mt-4 w-full'
                onClick={handleClose}
              >
                Maybe later
              </Button>
            </div>
          </MotionDialogPanel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export function IOSInstallPrompt() {
  const {shouldShow, dismiss} = useIOSInstallPrompt()
  const [forcedOpen, setForcedOpen] = useState(false)

  useEffect(() => {
    const onForce = () => setForcedOpen(true)
    window.addEventListener(IOS_INSTALL_FORCE_EVENT, onForce)
    return () => window.removeEventListener(IOS_INSTALL_FORCE_EVENT, onForce)
  }, [])

  const open = shouldShow || forcedOpen

  const handleClose = () => {
    if (forcedOpen) setForcedOpen(false)
    if (shouldShow) dismiss()
  }

  return (
    <IOSInstallSheet
      open={open}
      onClose={handleClose}
    />
  )
}
