'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Cancel01Icon, SparklesIcon, Tick01Icon } from 'hugeicons-react'
import { useEffect, useId, useRef, useState } from 'react'

interface TranslationExerciseProps {
  prompt: string
  options: string[]
  selected: string | null
  revealed: boolean
  correctAnswer: string
  isNew?: boolean
  onSelect: (option: string) => void
  onCheck: () => void
}

export function TranslationExercise({
  prompt,
  options,
  selected,
  revealed,
  correctAnswer,
  isNew = false,
  onSelect,
  onCheck,
}: TranslationExerciseProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const promptId = useId()
  const tooltipId = useId()

  useEffect(() => {
    if (!showTooltip) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTooltip])

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    option: string,
    index: number,
  ) => {
    if (revealed) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      const nextIndex = (index + 1) % options.length
      onSelect(options[nextIndex])
      document.getElementById(`translation-option-${nextIndex}`)?.focus()
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const prevIndex = (index - 1 + options.length) % options.length
      onSelect(options[prevIndex])
      document.getElementById(`translation-option-${prevIndex}`)?.focus()
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onSelect(option)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <div className='mb-2 flex items-center gap-2'>
          <p
            id={promptId}
            className='text-sm font-bold uppercase text-muted-foreground'
          >
            Translate this word
          </p>
          {isNew && (
            <span className='inline-flex items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-black uppercase tracking-wide text-purple-600 dark:text-purple-400'>
              <SparklesIcon
                size={12}
                strokeWidth={2.5}
                aria-hidden
              />
              New word
            </span>
          )}
        </div>

        {isNew ? (
          <div
            ref={tooltipRef}
            className='relative inline-block'
          >
            <button
              type='button'
              onClick={() => setShowTooltip(open => !open)}
              aria-expanded={showTooltip}
              aria-controls={tooltipId}
              aria-describedby={showTooltip ? tooltipId : undefined}
              className='text-3xl font-black font-display underline decoration-purple-400 decoration-dashed underline-offset-8'
            >
              {prompt}
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.span
                  id={tooltipId}
                  role='tooltip'
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className='absolute left-0 top-full z-10 mt-2 whitespace-nowrap rounded-xl border-2 border-border bg-card px-3 py-1.5 text-sm font-bold shadow-md'
                >
                  {correctAnswer}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <h2 className='text-3xl font-black font-display'>{prompt}</h2>
        )}
        {isNew && (
          <p className='mt-3 text-xs font-bold text-muted-foreground'>
            Tap the word to see its meaning.
          </p>
        )}
      </div>

      <div
        role='radiogroup'
        aria-labelledby={promptId}
        className='grid gap-3'
      >
        {options.map((option, index) => {
          const isSelected = selected === option
          const isCorrect = option === correctAnswer

          return (
            <button
              key={option}
              id={`translation-option-${index}`}
              type='button'
              role='radio'
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => onSelect(option)}
              onKeyDown={event => handleOptionKeyDown(event, option, index)}
              className={cn(
                'rounded-2xl border-2 border-border px-6 py-4 text-left font-bold transition-all',
                !revealed && isSelected && 'border-primary bg-primary/10',
                !revealed &&
                  !isSelected &&
                  'hover:border-primary hover:bg-primary/5',
                revealed &&
                  isCorrect &&
                  'border-primary bg-primary/10 text-primary',
                revealed &&
                  isSelected &&
                  !isCorrect &&
                  'border-destructive bg-destructive/10 text-destructive animate-shake',
              )}
            >
              <span className='flex items-center justify-between'>
                {option}
                {revealed && isCorrect && (
                  <Tick01Icon
                    size={20}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                )}
                {revealed && isSelected && !isCorrect && (
                  <Cancel01Icon
                    size={20}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>

      {!revealed && (
        <Button
          onClick={onCheck}
          disabled={!selected}
          className='w-full'
          size='lg'
        >
          Check
        </Button>
      )}
    </div>
  )
}

export function XpPop({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 text-2xl font-black text-primary'
          aria-hidden
        >
          +10 XP
        </motion.span>
      )}
    </AnimatePresence>
  )
}
