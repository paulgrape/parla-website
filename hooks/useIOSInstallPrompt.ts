'use client'

import {IOS_INSTALL_DISMISSED_KEY, setIOSInstallDismissed, shouldShowIOSInstallPrompt} from '@/lib/pwa'
import {useCallback, useSyncExternalStore} from 'react'

const DISMISS_EVENT = 'llp:ios-install-dismissed'

function subscribeDismissed(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === IOS_INSTALL_DISMISSED_KEY) onStoreChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(DISMISS_EVENT, onStoreChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(DISMISS_EVENT, onStoreChange)
  }
}

function getShouldShowSnapshot() {
  return shouldShowIOSInstallPrompt()
}

function getServerSnapshot() {
  return false
}

export function useIOSInstallPrompt() {
  const shouldShow = useSyncExternalStore(subscribeDismissed, getShouldShowSnapshot, getServerSnapshot)

  const dismiss = useCallback(() => {
    setIOSInstallDismissed()
    window.dispatchEvent(new Event(DISMISS_EVENT))
  }, [])

  return {shouldShow, dismiss}
}
