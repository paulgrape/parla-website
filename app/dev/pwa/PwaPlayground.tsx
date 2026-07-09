'use client'

import {Button} from '@/components/ui/button'
import {forceIOSInstallPrompt} from '@/lib/pwa'

export function PwaPlayground() {
  return (
    <div className='bg-muted/40 min-h-screen p-6'>
      <div className='mx-auto max-w-3xl space-y-6'>
        <div>
          <h1 className='font-display text-3xl font-black'>PWA install prompt</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Dev preview for the iOS install bottom sheet. Use a narrow viewport or device toolbar for realistic layout.
          </p>
        </div>

        <div className='border-border bg-background mx-auto w-full max-w-[390px] overflow-hidden rounded-[2rem] border-4 shadow-lg'>
          <div className='bg-muted border-border flex items-center justify-center border-b px-4 py-2'>
            <span className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>Phone preview</span>
          </div>

          <div className='flex min-h-[640px] flex-col p-4'>
            <p className='text-muted-foreground mb-auto text-sm'>
              Simulated start screen. Tap below to open the install instructions sheet.
            </p>

            <Button
              type='button'
              className='mt-6 w-full'
              onClick={() => forceIOSInstallPrompt()}
            >
              Show install prompt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
