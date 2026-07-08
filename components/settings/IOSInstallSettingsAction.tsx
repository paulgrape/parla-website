'use client'

import {Button} from '@/components/ui/button'
import {useIOSInstallPrompt} from '@/hooks/useIOSInstallPrompt'
import {isIOS} from '@/lib/pwa'
import {useSyncExternalStore} from 'react'

function subscribeIOSDevice(onStoreChange: () => void) {
  window.addEventListener('resize', onStoreChange)
  return () => window.removeEventListener('resize', onStoreChange)
}

function getIOSSnapshot() {
  return isIOS()
}

function getIOSServerSnapshot() {
  return false
}

export function IOSInstallSettingsAction() {
  const isIosDevice = useSyncExternalStore(subscribeIOSDevice, getIOSSnapshot, getIOSServerSnapshot)
  const {showAgain} = useIOSInstallPrompt()

  if (!isIosDevice) return null

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
