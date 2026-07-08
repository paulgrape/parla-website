'use client'

import {
  IOS_INSTALL_STATE_EVENT,
  clearIOSInstallDismissed,
  forceIOSInstallPrompt,
  setIOSInstallDismissed,
  shouldShowIOSInstallPrompt
} from '@/lib/pwa'
import {useCallback, useSyncExternalStore} from 'react'

function subscribeIOSInstallState(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === 'llp:ios-install-dismissed') onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(IOS_INSTALL_STATE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(IOS_INSTALL_STATE_EVENT, onStoreChange)
  }
}

function getShouldShowSnapshot() {
  return shouldShowIOSInstallPrompt()
}

function getServerSnapshot() {
  return false
}

export function useIOSInstallPrompt() {
  const shouldShow = useSyncExternalStore(subscribeIOSInstallState, getShouldShowSnapshot, getServerSnapshot)

  const dismiss = useCallback(() => {
    setIOSInstallDismissed()
  }, [])

  const showAgain = useCallback(() => {
    clearIOSInstallDismissed()
    if (!shouldShowIOSInstallPrompt()) {
      forceIOSInstallPrompt()
    }
  }, [])

  return {shouldShow, dismiss, showAgain}
}
