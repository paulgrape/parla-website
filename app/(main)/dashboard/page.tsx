import {DashboardContent} from '@/components/dashboard/DashboardContent'
import {DashboardSkeleton} from '@/components/skeletons/PageSkeletons'
import {auth} from '@clerk/nextjs/server'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'

export default async function DashboardPage() {
  const {userId} = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
