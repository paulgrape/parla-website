'use client'

import {Button} from '@/components/ui/button'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {ArrowLeft01Icon, ArrowRight01Icon} from 'hugeicons-react'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import {useCallback, useEffect, useRef, useState, useSyncExternalStore} from 'react'

export interface InstallStep {
  srcLight: string
  srcDark: string
  alt: string
  caption: string
}

interface InstallCarouselProps {
  steps: InstallStep[]
  className?: string
}

export function InstallCarousel({steps, className}: InstallCarouselProps) {
  const [index, setIndex] = useState(0)
  const [width, setWidth] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const scrollRafRef = useRef<number | null>(null)
  const prevWidthRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const {resolvedTheme} = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const isDark = mounted && resolvedTheme === 'dark'

  useEffect(() => {
    const node = viewportRef.current
    if (!node) return

    const updateWidth = () => setWidth(node.offsetWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback(
    (next: number) => {
      const node = viewportRef.current
      if (!node || width <= 0) return

      const clamped = Math.max(0, Math.min(steps.length - 1, next))
      setIndex(clamped)
      node.scrollTo({
        left: clamped * width,
        behavior: reducedMotion ? 'auto' : 'smooth'
      })
    },
    [reducedMotion, steps.length, width]
  )

  useEffect(() => {
    const node = viewportRef.current
    if (!node || width <= 0) return

    const onScroll = () => {
      if (scrollRafRef.current !== null) return
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null
        const nextIndex = Math.round(node.scrollLeft / width)
        setIndex(Math.max(0, Math.min(steps.length - 1, nextIndex)))
      })
    }

    node.addEventListener('scroll', onScroll, {passive: true})
    return () => {
      node.removeEventListener('scroll', onScroll)
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [steps.length, width])

  useEffect(() => {
    const node = viewportRef.current
    if (!node || width <= 0) return
    if (prevWidthRef.current === width) return
    node.scrollLeft = index * width
    prevWidthRef.current = width
  }, [index, width])

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        ref={viewportRef}
        className='relative -mx-1 flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain scroll-smooth [&::-webkit-scrollbar]:hidden'
        style={{touchAction: 'pan-x'}}
        aria-roledescription='carousel'
        aria-label='Install steps'
      >
        {steps.map((step, i) => (
          <div
            key={step.alt}
            className='w-full shrink-0 snap-center snap-always px-1'
            style={{width: width || '100%'}}
            role='group'
            aria-roledescription='slide'
            aria-label={`${i + 1} of ${steps.length}`}
            aria-hidden={i !== index}
          >
            <div className='bg-muted relative aspect-[390/520] max-h-[34dvh] w-full overflow-hidden rounded-2xl sm:max-h-[42dvh]'>
              <Image
                src={isDark ? step.srcDark : step.srcLight}
                alt={step.alt}
                fill
                className='object-contain'
                sizes='(max-width: 512px) 100vw, 480px'
                unoptimized
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <p
        className='text-foreground text-center text-sm font-semibold'
        aria-live='polite'
      >
        {steps[index]?.caption}
      </p>

      <div className='flex items-center justify-between gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          aria-label='Previous step'
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          <ArrowLeft01Icon
            className='size-5'
            aria-hidden
          />
        </Button>

        <div
          className='flex items-center gap-2'
          aria-hidden
        >
          {steps.map((step, i) => (
            <span
              key={step.alt}
              className={cn('size-2 rounded-full transition-colors', i === index ? 'bg-primary' : 'bg-border')}
            />
          ))}
        </div>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          aria-label='Next step'
          disabled={index === steps.length - 1}
          onClick={() => goTo(index + 1)}
        >
          <ArrowRight01Icon
            className='size-5'
            aria-hidden
          />
        </Button>
      </div>
    </div>
  )
}
