'use client'

import {ProfileStatsHeader} from '@/components/account/ProfileStatsHeader'
import {AvatarPlaceholder, TextSkeleton} from '@/components/skeletons/UserStatsSkeletons'
import {cn} from '@/lib/utils'
import {useClerk, useUser} from '@clerk/nextjs'
import {Logout01Icon, Settings01Icon} from 'hugeicons-react'
import {useRouter} from 'next/navigation'
import {useEffect, useId, useRef, useState, useSyncExternalStore} from 'react'
import {createPortal} from 'react-dom'

interface UserMenuProps {
  variant?: 'full' | 'compact'
}

interface PopoverPosition {
  top: number
  left: number
  width: number
  transform?: string
  maxHeight?: number
}

const POPOVER_WIDTH = 448
const POPOVER_GAP = 8
const VIEWPORT_PADDING = 16
const MOBILE_NAV_HEIGHT = 72

function getViewportWidth() {
  return window.visualViewport?.width ?? document.documentElement.clientWidth
}

function getAvailableWidth() {
  return getViewportWidth() - VIEWPORT_PADDING * 2
}

function getPopoverWidth(variant: 'full' | 'compact') {
  const available = getAvailableWidth()
  if (variant === 'compact') {
    return available
  }
  return Math.min(POPOVER_WIDTH, available)
}

function isMobileLayout(variant: 'full' | 'compact') {
  return variant === 'compact'
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

function UserAvatar({imageUrl, fallback, size}: {imageUrl?: string; fallback: string; size: number}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=''
        style={{width: size, height: size}}
        className='border-border shrink-0 rounded-full border-2 object-cover'
      />
    )
  }
  return (
    <div
      aria-hidden
      style={{width: size, height: size}}
      className='border-border bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-full border-2 text-sm font-black'
    >
      {fallback}
    </div>
  )
}

function getPopoverPosition(trigger: HTMLElement, variant: 'full' | 'compact'): PopoverPosition {
  const rect = trigger.getBoundingClientRect()
  const width = getPopoverWidth(variant)
  const mobile = isMobileLayout(variant)
  const viewportWidth = getViewportWidth()

  let left = mobile ? VIEWPORT_PADDING : rect.left

  left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - width - VIEWPORT_PADDING))

  if (mobile) {
    const top = rect.bottom + POPOVER_GAP
    const maxHeight = window.innerHeight - top - MOBILE_NAV_HEIGHT - VIEWPORT_PADDING

    return {
      top: Math.max(VIEWPORT_PADDING, top),
      left,
      width,
      maxHeight: Math.max(200, maxHeight)
    }
  }

  if (variant === 'full') {
    return {
      top: rect.top - POPOVER_GAP,
      left,
      width,
      transform: 'translateY(-100%)'
    }
  }

  return {
    top: rect.bottom + POPOVER_GAP,
    left,
    width
  }
}

export function UserMenu({variant = 'full'}: UserMenuProps) {
  const {user, isLoaded} = useUser()
  const {signOut} = useClerk()
  const router = useRouter()
  const menuId = useId()
  const isClient = useIsClient()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const identityPending = !isLoaded
  const displayName = user?.firstName || user?.username || ''
  const fallback = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    if (!open || !triggerRef.current) return

    function updatePosition() {
      if (!triggerRef.current) return
      setPosition(getPopoverPosition(triggerRef.current, variant))
    }

    updatePosition()
    const frame = requestAnimationFrame(updatePosition)

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.visualViewport?.addEventListener('resize', updatePosition)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      window.visualViewport?.removeEventListener('resize', updatePosition)
    }
  }, [open, variant])

  useEffect(() => {
    if (!open || !panelRef.current || !triggerRef.current) return

    function updatePosition() {
      if (!triggerRef.current) return
      setPosition(getPopoverPosition(triggerRef.current, variant))
    }

    const observer = new ResizeObserver(updatePosition)
    observer.observe(panelRef.current)

    return () => observer.disconnect()
  }, [open, variant, position])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !signingOut) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, signingOut])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut({redirectUrl: '/sign-in'})
    } catch {
      setSigningOut(false)
    }
  }

  function handleProfileSettings() {
    setOpen(false)
    router.push('/settings?tab=profile')
  }

  const triggerProps = {
    ref: triggerRef,
    type: 'button' as const,
    'aria-expanded': open,
    'aria-haspopup': 'dialog' as const,
    'aria-controls': menuId,
    onClick: () => setOpen(value => !value)
  }

  const popover =
    open && position && isClient ? (
      <div
        ref={panelRef}
        id={menuId}
        role='dialog'
        aria-label='Account menu'
        style={{
          position: 'fixed',
          left: position.left,
          top: position.top,
          width: position.width,
          maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`,
          maxHeight: position.maxHeight,
          transform: position.transform,
          zIndex: 100
        }}
        className={cn(
          'border-border bg-card box-border overflow-x-hidden overflow-y-auto rounded-3xl border-2 p-3 shadow-lg sm:p-4',
          variant === 'compact' ? 'max-h-[calc(100vh-5rem)]' : 'max-h-[min(32rem,calc(100vh-4rem))]'
        )}
      >
        <div className='min-w-0 space-y-3 sm:space-y-4'>
          <ProfileStatsHeader compact />

          <div className='min-w-0 space-y-2 sm:space-y-3'>
            <button
              type='button'
              onClick={handleProfileSettings}
              className='border-border bg-card text-foreground hover:bg-muted focus-visible:ring-primary flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border-2 px-3 text-xs font-bold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-12 sm:px-4 sm:text-sm'
            >
              <Settings01Icon
                size={18}
                strokeWidth={2}
                aria-hidden
                className='shrink-0'
              />
              Profile settings
            </button>

            <button
              type='button'
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className='bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:ring-primary flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-bold tracking-wide uppercase shadow-[0_4px_0_0_#46a302] transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:translate-y-0 sm:h-12 sm:px-4 sm:text-sm'
            >
              <Logout01Icon
                size={18}
                strokeWidth={2}
                aria-hidden
                className='shrink-0'
              />
              {signingOut ? 'Signing out…' : 'Log out'}
            </button>
          </div>
        </div>
      </div>
    ) : null

  return (
    <div className={cn('h-fit', variant === 'full' && 'w-full')}>
      {variant === 'full' ? (
        <button
          {...triggerProps}
          aria-busy={identityPending}
          className='hover:bg-muted focus-visible:ring-primary flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
        >
          {identityPending ? (
            <AvatarPlaceholder size={36} />
          ) : (
            <UserAvatar
              imageUrl={user?.imageUrl}
              fallback={fallback}
              size={36}
            />
          )}
          {identityPending ? (
            <TextSkeleton className='h-4 w-24' />
          ) : (
            <span className='min-w-0 flex-1 truncate text-sm'>{displayName}</span>
          )}
        </button>
      ) : (
        <button
          {...triggerProps}
          aria-label='Open account menu'
          aria-busy={identityPending}
          className='focus-visible:ring-primary flex items-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
        >
          {identityPending ? (
            <AvatarPlaceholder size={32} />
          ) : (
            <UserAvatar
              imageUrl={user?.imageUrl}
              fallback={fallback}
              size={32}
            />
          )}
        </button>
      )}

      {popover ? createPortal(popover, document.body) : null}
    </div>
  )
}
