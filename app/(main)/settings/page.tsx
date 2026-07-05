import { SettingsContent } from '@/components/settings/SettingsContent'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

function SettingsFallback() {
  return (
    <div className='mx-auto max-w-lg space-y-6'>
      <h1 className='text-3xl font-black font-display'>Settings</h1>
      <p className='text-sm text-muted-foreground'>Loading…</p>
    </div>
  )
}

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <Suspense fallback={<SettingsFallback />}>
      <SettingsContent />
    </Suspense>
  )
}
