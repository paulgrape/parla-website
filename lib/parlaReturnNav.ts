const ALLOWED_RETURN_ROOTS = [
  '/dashboard',
  '/lesson',
  '/sections',
  '/guidebook',
  '/review',
  '/settings',
  '/account',
] as const

export function isSafeInternalPath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path.includes('\\') || path.includes('://')) return false

  const pathname = path.split('?')[0].split('#')[0]

  if (pathname === '/') return true

  return ALLOWED_RETURN_ROOTS.some(
    root => pathname === root || pathname.startsWith(`${root}/`),
  )
}

export function getReferrerPath(): string | null {
  if (typeof document === 'undefined' || !document.referrer) return null

  try {
    const ref = new URL(document.referrer)
    if (ref.origin !== window.location.origin) return null
    const path = ref.pathname + ref.search
    return isSafeInternalPath(ref.pathname) ? path : null
  } catch {
    return null
  }
}

export function legalHrefWithFrom(href: string, pathname: string): string {
  return `${href}?from=${encodeURIComponent(pathname)}`
}
