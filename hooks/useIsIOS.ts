'use client'

import {isIOS} from '@/lib/pwa'
import {useSyncExternalStore} from 'react'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('resize', onStoreChange)
  return () => window.removeEventListener('resize', onStoreChange)
}

function getSnapshot() {
  return isIOS()
}

function getServerSnapshot() {
  return false
}

export function useIsIOS() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
