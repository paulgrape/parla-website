'use client'

import {useSyncExternalStore} from 'react'

export const SOUND_ENABLED_STORAGE_KEY = 'llp:soundEnabled'
const SOUND_SETTINGS_CHANGE_EVENT = 'sound-settings-change'

function subscribeSoundEnabled(onStoreChange: () => void) {
  const handleChange = () => onStoreChange()
  window.addEventListener(SOUND_SETTINGS_CHANGE_EVENT, handleChange)
  window.addEventListener('storage', handleChange)
  return () => {
    window.removeEventListener(SOUND_SETTINGS_CHANGE_EVENT, handleChange)
    window.removeEventListener('storage', handleChange)
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== 'false'
}

function getSoundEnabledSnapshot() {
  return isSoundEnabled()
}

function getSoundEnabledServerSnapshot() {
  return true
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(enabled))
  window.dispatchEvent(new Event(SOUND_SETTINGS_CHANGE_EVENT))
}

export function useSoundEnabled() {
  const enabled = useSyncExternalStore(subscribeSoundEnabled, getSoundEnabledSnapshot, getSoundEnabledServerSnapshot)

  return {
    enabled,
    setEnabled: setSoundEnabled
  }
}
