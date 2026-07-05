'use client'

import { legalHrefWithFrom } from '@/lib/parlaReturnNav'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/about', label: 'About', asideLabel: 'ABOUT' },
  { href: '/terms', label: 'Terms of Service', asideLabel: 'TERMS' },
  { href: '/privacy', label: 'Privacy Policy', asideLabel: 'PRIVACY' },
] as const

const footerLinkClassName =
  'underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'

const asideLinkClassName =
  'transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'

interface LegalLinksProps {
  className?: string
  variant?: 'footer' | 'aside'
}

export function LegalLinks({ className, variant = 'footer' }: LegalLinksProps) {
  const pathname = usePathname()

  if (variant === 'aside') {
    return (
      <nav
        aria-label='Legal'
        className={cn(
          'flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70',
          className,
        )}
      >
        {links.map(({ href, asideLabel }) => (
          <Link
            key={href}
            href={legalHrefWithFrom(href, pathname)}
            className={asideLinkClassName}
          >
            {asideLabel}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav
      aria-label='Legal'
      className={cn(
        'text-center text-sm text-muted-foreground',
        className,
      )}
    >
      {links.map(({ href, label }, index) => (
        <span key={href}>
          {index > 0 && <span aria-hidden='true'> · </span>}
          <Link
            href={legalHrefWithFrom(href, pathname)}
            className={footerLinkClassName}
          >
            {label}
          </Link>
        </span>
      ))}
    </nav>
  )
}
