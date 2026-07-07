import {SectionsContent} from '@/components/sections/SectionsContent'
import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'

export default async function SectionsPage() {
  const {userId} = await auth()
  if (!userId) redirect('/sign-in')

  return <SectionsContent />
}
