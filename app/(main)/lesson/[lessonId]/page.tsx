import { LessonContent } from '@/components/lesson/LessonContent'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return <LessonContent lessonId={lessonId} />
}
