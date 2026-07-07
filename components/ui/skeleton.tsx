import {cn} from '@/lib/utils'

export function Skeleton({className, ...props}: React.ComponentProps<'div'>) {
  return (
    <div
      aria-hidden
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  )
}
