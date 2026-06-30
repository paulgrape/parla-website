'use client'

import { cn } from '@/lib/utils'
import { ArrowReloadHorizontalIcon, Home01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Learn', icon: Home01Icon },
  { href: '/review', label: 'Review', icon: ArrowReloadHorizontalIcon },
]

export function MobileNav() {
  const pathname = usePathname()

  // Immersive lesson flow: hide the nav while inside a lesson.
  if (pathname.startsWith('/lesson/')) return null

  return (
    <nav className='fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-border bg-card md:hidden'>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-bold transition-colors',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon
              size={24}
              strokeWidth={2}
            />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
