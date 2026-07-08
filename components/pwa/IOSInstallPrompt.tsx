'use client'

import {InstallCarousel, type InstallStep} from '@/components/pwa/InstallCarousel'
import {Button} from '@/components/ui/button'
import {Dialog} from '@/components/ui/dialog'
import {MotionDialogPanel} from '@/components/ui/motion'
import {useIOSInstallPrompt} from '@/hooks/useIOSInstallPrompt'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {APP_NAME} from '@/lib/constants'
import {AnimatePresence} from 'framer-motion'
import {Cancel01Icon} from 'hugeicons-react'
import {useId} from 'react'

const INSTALL_STEPS: InstallStep[] = [
  {
    src: '/pwa/step-1.svg',
    alt: 'Safari browser with the Share button highlighted in the bottom toolbar',
    caption: '1. Tap Share in Safari'
  },
  {
    src: '/pwa/step-2.svg',
    alt: 'iOS share sheet with Add to Home Screen highlighted',
    caption: '2. Choose Add to Home Screen'
  },
  {
    src: '/pwa/step-3.svg',
    alt: 'Add to Home Screen confirmation with Add button highlighted',
    caption: '3. Tap Add to install'
  }
]

export function IOSInstallPrompt() {
  const {shouldShow, dismiss} = useIOSInstallPrompt()
  const titleId = useId()
  const descriptionId = useId()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {shouldShow && (
        <Dialog
          open={shouldShow}
          titleId={titleId}
          descriptionId={descriptionId}
          onClose={dismiss}
          closeOnBackdrop
          closeOnEscape
          backdropLabel='Dismiss install tip'
          variant='bottom'
        >
          <MotionDialogPanel
            variant='bottom'
            drag={reducedMotion ? false : 'y'}
            dragConstraints={{top: 0, bottom: 0}}
            dragElastic={{top: 0, bottom: 0.4}}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 500) dismiss()
            }}
            className='bg-card border-border w-full rounded-t-3xl border-t-2 px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'
          >
            <div
              className='bg-border mx-auto mb-3 h-1.5 w-10 rounded-full'
              aria-hidden
            />

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
                onClick={dismiss}
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
              onClick={dismiss}
            >
              Maybe later
            </Button>
          </MotionDialogPanel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
