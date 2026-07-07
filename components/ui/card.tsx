import {cn} from '@/lib/utils'

export function Card({className, children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-border bg-card rounded-3xl border-2 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
