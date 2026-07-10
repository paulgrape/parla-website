'use client'

import {canShowIOSInstallSettings} from '@/lib/pwa'
import {useSyncExternalStore} from 'react'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('resize', onStoreChange)
  return () => window.removeEventListener('resize', onStoreChange)
}

function getSnapshot() {
  return canShowIOSInstallSettings()
}

function getServerSnapshot() {
  return false
}

export function useCanShowIOSInstallSettings() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
