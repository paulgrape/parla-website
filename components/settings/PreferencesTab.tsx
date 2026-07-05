'use client'

import { Card } from '@/components/ui/card'
import { useSoundEnabled } from '@/hooks/useSoundEnabled'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const

type ThemeOption = (typeof THEME_OPTIONS)[number]['value']

export function PreferencesTab() {
  const { theme, setTheme } = useTheme()
  const { enabled: soundEnabled, setEnabled: setSoundEnabled } = useSoundEnabled()
  const themeReady = theme !== undefined
  const activeTheme = (theme ?? 'system') as ThemeOption

  return (
    <div className='space-y-6'>
      <Card className='space-y-4'>
        <div>
          <h2 className='text-lg font-bold'>Appearance</h2>
          <p className='text-sm text-muted-foreground'>Light / dark mode</p>
        </div>
        <div
          role='group'
          aria-label='Theme'
          className='flex gap-2'
        >
          {THEME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type='button'
              aria-pressed={themeReady ? activeTheme === value : undefined}
              disabled={!themeReady}
              onClick={() => setTheme(value)}
              className={cn(
                'flex-1 rounded-2xl border-2 px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                themeReady && activeTheme === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-foreground hover:bg-muted',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card className='flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-lg font-bold'>Sound effects</h2>
          <p className='text-sm text-muted-foreground'>
            Play sounds for answers and navigation
          </p>
        </div>
        <button
          type='button'
          role='switch'
          aria-checked={soundEnabled}
          aria-label='Sound effects'
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            'relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            soundEnabled
              ? 'border-primary bg-primary'
              : 'border-border bg-muted',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow transition-transform',
              soundEnabled ? 'translate-x-6' : 'translate-x-0.5',
            )}
          />
        </button>
      </Card>
    </div>
  )
}
