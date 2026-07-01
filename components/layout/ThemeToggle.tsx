'use client'

import { cn } from '@/lib/utils'
import { Moon01Icon, Sun01Icon } from 'hugeicons-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label='Toggle theme'
      aria-pressed={mounted ? isDark : undefined}
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-300 hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center transition-transform duration-300 ease-in-out',
          mounted && isDark && 'rotate-90',
        )}
      >
        {!mounted ? (
          <Moon01Icon
            size={18}
            strokeWidth={2}
            className='opacity-50'
            aria-hidden
          />
        ) : isDark ? (
          <Sun01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
        ) : (
          <Moon01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
        )}
      </span>
    </button>
  )
}
