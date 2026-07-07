'use client'

import {PreferencesTab} from '@/components/settings/PreferencesTab'
import {ProfileTab} from '@/components/settings/ProfileTab'
import {cn} from '@/lib/utils'
import {useRouter, useSearchParams} from 'next/navigation'
import {useId} from 'react'

type SettingsTab = 'preferences' | 'profile'

const TABS = [
  {value: 'preferences', label: 'Preferences'},
  {value: 'profile', label: 'Profile'}
] as const

export function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const baseId = useId()
  const tab: SettingsTab = searchParams.get('tab') === 'profile' ? 'profile' : 'preferences'

  function selectTab(next: SettingsTab) {
    router.replace(`/settings?tab=${next}`, {scroll: false})
  }

  return (
    <div className='mx-auto max-w-lg space-y-6'>
      <h1 className='font-display text-3xl font-black'>Settings</h1>

      <div
        role='tablist'
        aria-label='Settings sections'
        className='border-border flex gap-2 rounded-2xl border-2 p-1'
      >
        {TABS.map(({value, label}) => {
          const active = tab === value
          return (
            <button
              key={value}
              type='button'
              role='tab'
              id={`${baseId}-tab-${value}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${value}`}
              onClick={() => selectTab(value)}
              className={cn(
                'focus-visible:ring-primary flex-1 rounded-xl px-4 py-2 text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div
        role='tabpanel'
        id={`${baseId}-panel-${tab}`}
        aria-labelledby={`${baseId}-tab-${tab}`}
      >
        {tab === 'preferences' ? <PreferencesTab /> : <ProfileTab />}
      </div>
    </div>
  )
}
