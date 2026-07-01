import { Skeleton } from '@/components/ui/skeleton'

function LoadingStatus({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      role='status'
      aria-busy='true'
      className={className}
    >
      <span className='sr-only'>{label}</span>
      {children}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <LoadingStatus
      label='Loading your path...'
      className='space-y-8'
    >
      <div className='flex items-center justify-between gap-4'>
        <Skeleton className='h-8 w-24 rounded-lg' />
        <Skeleton className='h-5 w-32' />
      </div>

      {[0, 1, 2].map(unitIndex => (
        <div
          key={unitIndex}
          className='space-y-0'
        >
          <Skeleton className='h-20 w-full rounded-2xl' />
          <div className='flex flex-col items-center gap-4 pt-8'>
            {[0, 1, 2, 3].map(lessonIndex => (
              <Skeleton
                key={lessonIndex}
                className='h-16 w-16 rounded-full'
                style={{
                  marginLeft:
                    lessonIndex % 4 === 1
                      ? '-3rem'
                      : lessonIndex % 4 === 3
                        ? '3rem'
                        : 0,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </LoadingStatus>
  )
}

export function SectionsSkeleton() {
  return (
    <LoadingStatus
      label='Loading sections...'
      className='space-y-6'
    >
      <Skeleton className='h-8 w-20 rounded-lg' />

      <div className='space-y-4'>
        {[0, 1, 2, 3].map(index => (
          <div
            key={index}
            className='overflow-hidden rounded-2xl border-2 border-border bg-card'
          >
            <Skeleton className='h-24 w-full rounded-none' />
            <div className='flex items-center justify-between gap-4 p-5'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-24' />
              </div>
              <Skeleton className='h-10 w-24 rounded-xl' />
            </div>
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}

export function SectionDetailSkeleton() {
  return (
    <LoadingStatus
      label='Loading section...'
      className='space-y-6'
    >
      <Skeleton className='h-8 w-28 rounded-lg' />
      <Skeleton className='h-36 w-full rounded-2xl' />

      <div className='space-y-3'>
        <Skeleton className='h-6 w-32' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
        <Skeleton className='h-20 w-full rounded-2xl' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-6 w-40' />
        <div className='rounded-2xl border-2 border-border bg-card px-4'>
          {[0, 1, 2].map(index => (
            <div
              key={index}
              className='border-b border-border py-4 last:border-b-0'
            >
              <Skeleton className='h-5 w-48' />
            </div>
          ))}
        </div>
      </div>
    </LoadingStatus>
  )
}

export function GuidebookSkeleton() {
  return (
    <LoadingStatus
      label='Loading guidebook...'
      className='space-y-8'
    >
      <Skeleton className='h-8 w-20 rounded-lg' />

      <div className='space-y-2'>
        <Skeleton className='h-9 w-3/4' />
        <Skeleton className='h-4 w-full max-w-md' />
      </div>

      <div className='space-y-3'>
        <Skeleton className='h-4 w-28' />
        {[0, 1, 2, 3].map(index => (
          <div
            key={index}
            className='flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-4'
          >
            <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-56' />
            </div>
          </div>
        ))}
      </div>
    </LoadingStatus>
  )
}

export function ReviewSkeleton() {
  return (
    <LoadingStatus
      label='Loading reviews...'
      className='mx-auto max-w-lg space-y-6'
    >
      <div className='space-y-2'>
        <Skeleton className='h-8 w-56' />
        <Skeleton className='h-4 w-32' />
      </div>

      <Skeleton className='min-h-50 w-full rounded-3xl' />

      <div className='grid grid-cols-3 gap-2'>
        {[0, 1, 2].map(index => (
          <Skeleton
            key={index}
            className='h-12 w-full rounded-2xl'
          />
        ))}
      </div>
    </LoadingStatus>
  )
}

export function LessonSkeleton() {
  return (
    <LoadingStatus
      label='Loading level...'
      className='relative mx-auto max-w-lg px-4 py-6'
    >
      <div className='mb-6 flex items-center gap-3'>
        <Skeleton className='h-9 w-9 shrink-0 rounded-full' />
        <Skeleton className='h-3 flex-1 rounded-full' />
        <div className='flex gap-1'>
          {[0, 1, 2, 3, 4].map(index => (
            <Skeleton
              key={index}
              className='h-6 w-6 rounded-full'
            />
          ))}
        </div>
      </div>

      <div className='space-y-6'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-5 w-full' />
        <div className='space-y-3'>
          {[0, 1, 2, 3].map(index => (
            <Skeleton
              key={index}
              className='h-14 w-full rounded-2xl'
            />
          ))}
        </div>
      </div>
    </LoadingStatus>
  )
}
