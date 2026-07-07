import {cn} from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  label?: string
}

export function Progress({value, className, label = 'Progress'}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role='progressbar'
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('bg-muted h-4 w-full overflow-hidden rounded-full', className)}
    >
      <div
        className='bg-primary h-full rounded-full transition-all duration-500'
        style={{width: `${clamped}%`}}
        aria-hidden
      />
    </div>
  )
}
