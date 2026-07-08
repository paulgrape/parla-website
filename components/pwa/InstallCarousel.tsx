'use client'

import {Button} from '@/components/ui/button'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {cn} from '@/lib/utils'
import {animate, m, useMotionValue} from 'framer-motion'
import {ArrowLeft01Icon, ArrowRight01Icon} from 'hugeicons-react'
import Image from 'next/image'
import {useCallback, useEffect, useRef, useState} from 'react'

export interface InstallStep {
  src: string
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
  const x = useMotionValue(0)
  const reducedMotion = useReducedMotion()

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
      const clamped = Math.max(0, Math.min(steps.length - 1, next))
      setIndex(clamped)
      if (width <= 0) return
      if (reducedMotion) {
        x.set(-clamped * width)
        return
      }
      void animate(x, -clamped * width, {type: 'spring', stiffness: 320, damping: 32})
    },
    [reducedMotion, steps.length, width, x]
  )

  useEffect(() => {
    if (width <= 0) return
    x.set(-index * width)
  }, [index, width, x])

  const onDragEnd = (_: unknown, info: {offset: {x: number}; velocity: {x: number}}) => {
    const threshold = width * 0.2
    if (info.offset.x < -threshold || info.velocity.x < -400) {
      goTo(index + 1)
    } else if (info.offset.x > threshold || info.velocity.x > 400) {
      goTo(index - 1)
    } else {
      goTo(index)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        ref={viewportRef}
        className='relative overflow-hidden rounded-2xl'
      >
        <m.div
          className='flex touch-pan-y'
          style={{x}}
          drag={reducedMotion ? false : 'x'}
          dragConstraints={width > 0 ? {left: -(steps.length - 1) * width, right: 0} : undefined}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {steps.map(step => (
            <div
              key={step.src}
              className='w-full shrink-0 px-1'
              style={{width: width || '100%'}}
            >
              <div className='bg-muted relative aspect-[390/520] overflow-hidden rounded-2xl'>
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  className='object-cover'
                  sizes='(max-width: 512px) 100vw, 480px'
                  unoptimized
                />
              </div>
            </div>
          ))}
        </m.div>
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
              key={step.src}
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
