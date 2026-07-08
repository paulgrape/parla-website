'use client'

import {useSyncExternalStore} from 'react'

export const HAPTICS_ENABLED_STORAGE_KEY = 'llp:hapticsEnabled'
const HAPTICS_SETTINGS_CHANGE_EVENT = 'haptics-settings-change'

function subscribeHapticsEnabled(onStoreChange: () => void) {
  const handleChange = () => onStoreChange()
  window.addEventListener(HAPTICS_SETTINGS_CHANGE_EVENT, handleChange)
  window.addEventListener('storage', handleChange)
  return () => {
    window.removeEventListener(HAPTICS_SETTINGS_CHANGE_EVENT, handleChange)
    window.removeEventListener('storage', handleChange)
  }
}

export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(HAPTICS_ENABLED_STORAGE_KEY) !== 'false'
}

function getHapticsEnabledSnapshot() {
  return isHapticsEnabled()
}

function getHapticsEnabledServerSnapshot() {
  return true
}

export function setHapticsEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(HAPTICS_ENABLED_STORAGE_KEY, String(enabled))
  window.dispatchEvent(new Event(HAPTICS_SETTINGS_CHANGE_EVENT))
}

function isLikelyMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches
}

export function isHapticsSupported(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator && isLikelyMobileDevice()
}

function subscribeHapticsSupported(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const pointerQuery = window.matchMedia('(pointer: coarse)')
  const hoverQuery = window.matchMedia('(hover: none)')
  const handleChange = () => onStoreChange()

  pointerQuery.addEventListener('change', handleChange)
  hoverQuery.addEventListener('change', handleChange)
  return () => {
    pointerQuery.removeEventListener('change', handleChange)
    hoverQuery.removeEventListener('change', handleChange)
  }
}

function getHapticsSupportedSnapshot() {
  return isHapticsSupported()
}

function getHapticsSupportedServerSnapshot() {
  return false
}

export function useHapticsSupported() {
  return useSyncExternalStore(subscribeHapticsSupported, getHapticsSupportedSnapshot, getHapticsSupportedServerSnapshot)
}

export function useHapticsEnabled() {
  const enabled = useSyncExternalStore(
    subscribeHapticsEnabled,
    getHapticsEnabledSnapshot,
    getHapticsEnabledServerSnapshot
  )

  return {
    enabled,
    setEnabled: setHapticsEnabled
  }
}
