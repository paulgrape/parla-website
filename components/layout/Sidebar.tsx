'use client'

import { ThemedUserButton } from '@/components/auth/ThemedUserButton'
import { AppLogo } from '@/components/layout/AppLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/utils'
import { BookOpen01Icon, Home01Icon, ArrowReloadHorizontalIcon, Settings01Icon } from 'hugeicons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Learn', icon: Home01Icon },
  { href: '/sections', label: 'Sections', icon: BookOpen01Icon },
  { href: '/review', label: 'Review', icon: ArrowReloadHorizontalIcon },
  { href: '/settings', label: 'Settings', icon: Settings01Icon },
]

export function Sidebar() {
  const pathname = usePathname()

  // Immersive lesson flow: hide the sidebar while inside a lesson.
  if (pathname.startsWith('/lesson/')) return null

  return (
    <aside className='sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r-2 border-border bg-card p-6 md:flex'>
      <AppLogo
        size='md'
        showTagline
      />

      <nav
        aria-label='Main navigation'
        className='flex flex-col gap-2'
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + '/')

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground hover:bg-muted',
              )}
            >
              <Icon
                size={20}
                strokeWidth={2}
                aria-hidden
              />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto flex items-center justify-between rounded-2xl px-2 py-2'>
        <div className='flex items-center gap-3'>
          <ThemedUserButton afterSignOutUrl='/sign-in' />
          <span className='text-sm font-bold text-muted-foreground'>
            Account
          </span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
