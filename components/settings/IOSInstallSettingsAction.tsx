'use client'

import {Button} from '@/components/ui/button'
import {useIOSInstallPrompt} from '@/hooks/useIOSInstallPrompt'

export function IOSInstallSettingsAction() {
  const {showAgain} = useIOSInstallPrompt()

  return (
    <Button
      type='button'
      variant='outline'
      className='w-full'
      onClick={showAgain}
    >
      Show install instructions
    </Button>
  )
}
