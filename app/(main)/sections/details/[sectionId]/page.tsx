import {SectionDetailContent} from '@/components/sections/SectionDetailContent'
import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'

export default async function SectionDetailPage({params}: {params: Promise<{sectionId: string}>}) {
  const {sectionId} = await params
  const {userId} = await auth()
  if (!userId) redirect('/sign-in')

  return <SectionDetailContent sectionId={sectionId} />
}
