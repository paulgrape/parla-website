'use client'

import {cn} from '@/lib/utils'
import {Moon01Icon, Sun01Icon} from 'hugeicons-react'
import {useTheme} from 'next-themes'
import {useSyncExternalStore} from 'react'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({className}: ThemeToggleProps) {
  const {resolvedTheme, setTheme} = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

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
        'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-primary flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center transition-transform duration-300 ease-in-out',
          mounted && isDark && 'rotate-90'
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
