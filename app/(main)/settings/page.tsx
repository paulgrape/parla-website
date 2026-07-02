import { SettingsContent } from '@/components/settings/SettingsContent'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return <SettingsContent />
}
