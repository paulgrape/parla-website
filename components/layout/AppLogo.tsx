import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
  tagline?: string
  href?: string | false
  titleAs?: 'h1' | 'span'
  centerTitle?: boolean
  className?: string
}

const sizeConfig = {
  sm: { icon: 28, title: 'text-lg' },
  md: { icon: 36, title: 'text-2xl' },
  lg: { icon: 40, title: 'text-4xl' },
} as const

export function AppLogo({
  size = 'md',
  showTagline = false,
  tagline,
  href = '/dashboard',
  titleAs = 'span',
  centerTitle = false,
  className,
}: AppLogoProps) {
  const { icon, title } = sizeConfig[size]
  const resolvedTagline = tagline ?? (showTagline ? APP_TAGLINE : undefined)
  const TitleTag = titleAs
  const hasTagline = Boolean(resolvedTagline)

  const titleEl = (
    <TitleTag
      className={cn(
        'font-black tracking-tight text-primary font-display',
        title,
      )}
    >
      {APP_NAME}
    </TitleTag>
  )

  const imageEl = (
    <Image
      src='/icon0.svg'
      alt=''
      width={icon}
      height={icon}
      className='shrink-0'
      priority
    />
  )

  const nameRow = centerTitle ? (
    <div className='grid w-full grid-cols-[1fr_auto_1fr] items-center'>
      <div className='col-start-1 flex items-center justify-end pr-3'>
        {imageEl}
      </div>
      <div className='col-start-2'>{titleEl}</div>
    </div>
  ) : (
    <div className='flex items-center gap-3'>
      {imageEl}
      {titleEl}
    </div>
  )

  const content = hasTagline ? (
    <>
      {nameRow}
      <p
        className={cn(
          'text-muted-foreground',
          centerTitle && 'text-center',
          size !== 'lg' && 'text-sm',
        )}
      >
        {resolvedTagline}
      </p>
    </>
  ) : (
    nameRow
  )

  const rootClassName = cn(
    hasTagline ? 'flex flex-col gap-1' : undefined,
    centerTitle && hasTagline && 'w-full items-center',
    !hasTagline && !centerTitle && 'flex items-center gap-3',
    !hasTagline && centerTitle && 'w-full',
    className,
  )

  if (href === false) {
    return <div className={rootClassName}>{content}</div>
  }

  return (
    <Link href={href} className={rootClassName}>
      {content}
    </Link>
  )
}
