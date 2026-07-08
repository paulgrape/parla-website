export const IOS_INSTALL_DISMISSED_KEY = 'llp:ios-install-dismissed'
export const IOS_INSTALL_STATE_EVENT = 'llp:ios-install-state-change'
export const IOS_INSTALL_FORCE_EVENT = 'llp:ios-install-force'

function dispatchIOSInstallStateChange() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(IOS_INSTALL_STATE_EVENT))
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  const ua = window.navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return true

  // iPadOS 13+ reports as Macintosh with touch
  return (
    window.navigator.platform === 'MacIntel' &&
    typeof window.navigator.maxTouchPoints === 'number' &&
    window.navigator.maxTouchPoints > 1
  )
}

export function isIOSSafari(): boolean {
  if (typeof window === 'undefined' || !isIOS()) return false

  const ua = window.navigator.userAgent
  // Chrome, Firefox, Edge, Opera, in-app browsers on iOS
  if (/CriOS|FxiOS|EdgiOS|OPiOS|OPT\//i.test(ua)) return false
  if (/GSA\//i.test(ua)) return false // Google app
  // Safari includes Version/… Safari/; exclude other WebViews that lack it
  return /Safari/i.test(ua) && /Version\//i.test(ua)
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false

  const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in window.navigator && Boolean((window.navigator as Navigator & {standalone?: boolean}).standalone)

  return displayModeStandalone || iosStandalone
}

export function isIOSInstallDismissed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(IOS_INSTALL_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function setIOSInstallDismissed(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(IOS_INSTALL_DISMISSED_KEY, '1')
    dispatchIOSInstallStateChange()
  } catch {
    // ignore quota / private mode
  }
}

export function clearIOSInstallDismissed(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(IOS_INSTALL_DISMISSED_KEY)
    dispatchIOSInstallStateChange()
  } catch {
    // ignore quota / private mode
  }
}

export function requestIOSInstallPrompt(): void {
  clearIOSInstallDismissed()
}

export function forceIOSInstallPrompt(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(IOS_INSTALL_FORCE_EVENT))
}

export function shouldShowIOSInstallPrompt(): boolean {
  return isIOSSafari() && !isStandalone() && !isIOSInstallDismissed()
}
