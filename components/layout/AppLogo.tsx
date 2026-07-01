import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface AppLogoProps {
  size?: 'sm' | 'md'
  showTagline?: boolean
  className?: string
}

const sizeConfig = {
  sm: { icon: 28, title: 'text-lg' },
  md: { icon: 36, title: 'text-2xl' },
} as const

export function AppLogo({
  size = 'md',
  showTagline = false,
  className,
}: AppLogoProps) {
  const { icon, title } = sizeConfig[size]

  return (
    <Link
      href='/dashboard'
      className={cn('flex items-center gap-3', className)}
    >
      <Image
        src='/icon0.svg'
        alt=''
        width={icon}
        height={icon}
        className='shrink-0'
        priority
      />
      <div>
        <span
          className={cn(
            'font-black tracking-tight text-primary font-display',
            title,
          )}
        >
          Parla
        </span>
        {showTagline && (
          <p className='text-sm text-muted-foreground'>Learn Italian</p>
        )}
      </div>
    </Link>
  )
}
