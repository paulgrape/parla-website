import { GuidebookContent } from '@/components/guidebook/GuidebookContent'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function GuidebookPage({
  params,
}: {
  params: Promise<{ unitId: string }>
}) {
  const { unitId } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return <GuidebookContent unitId={unitId} />
}
