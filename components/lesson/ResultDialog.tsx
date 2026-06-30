'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Alert02Icon, Tick01Icon } from 'hugeicons-react'

export type ResultDialogVariant = 'correct' | 'wrong' | 'info'

interface ResultDialogProps {
  open: boolean
  variant: ResultDialogVariant
  title: string
  message?: string
  correctAnswer?: string
  buttonLabel?: string
  onContinue: () => void
}

const VARIANT_STYLES: Record<
  ResultDialogVariant,
  { sheet: string; icon: string; iconBg: string; button: string }
> = {
  correct: {
    sheet: 'border-primary bg-primary/10',
    icon: 'text-primary',
    iconBg: 'bg-primary/15',
    button: '',
  },
  wrong: {
    sheet: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-500/10',
    icon: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-400/20',
    button:
      'bg-yellow-500 text-white shadow-[0_4px_0_0_#b45309] hover:bg-yellow-600',
  },
  info: {
    sheet: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-500/10',
    icon: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-400/20',
    button:
      'bg-yellow-500 text-white shadow-[0_4px_0_0_#b45309] hover:bg-yellow-600',
  },
}

export function ResultDialog({
  open,
  variant,
  title,
  message,
  correctAnswer,
  buttonLabel = 'Continue',
  onContinue,
}: ResultDialogProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-x-0 bottom-0 z-50 flex justify-center'
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          <div
            className={cn(
              'w-full max-w-lg rounded-t-3xl border-t-2 px-5 pb-8 pt-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]',
              styles.sheet,
            )}
          >
            <div className='flex items-center gap-3'>
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                  styles.iconBg,
                )}
              >
                {variant === 'correct' ? (
                  <Tick01Icon
                    size={28}
                    strokeWidth={2.5}
                    className={styles.icon}
                  />
                ) : (
                  <Alert02Icon
                    size={28}
                    strokeWidth={2.5}
                    className={styles.icon}
                  />
                )}
              </div>
              <div>
                <h3
                  className={cn(
                    'text-2xl font-black font-display',
                    styles.icon,
                  )}
                >
                  {title}
                </h3>
                {correctAnswer && (
                  <p className='text-sm font-bold text-muted-foreground'>
                    Correct answer:{' '}
                    <span className={styles.icon}>{correctAnswer}</span>
                  </p>
                )}
                {message && (
                  <p className='text-sm font-bold text-muted-foreground'>
                    {message}
                  </p>
                )}
              </div>
            </div>

            <Button
              onClick={onContinue}
              size='lg'
              className={cn('mt-5 w-full', styles.button)}
            >
              {buttonLabel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
