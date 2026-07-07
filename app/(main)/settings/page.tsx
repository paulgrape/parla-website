import {SettingsContent} from '@/components/settings/SettingsContent'
import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'

function SettingsFallback() {
  return (
    <div className='mx-auto max-w-lg space-y-6'>
      <h1 className='font-display text-3xl font-black'>Settings</h1>
      <p className='text-muted-foreground text-sm'>Loading…</p>
    </div>
  )
}

export default async function SettingsPage() {
  const {userId} = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsContent />
    </Suspense>
  )
}
