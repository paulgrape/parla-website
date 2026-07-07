'use client'

import {Button} from '@/components/ui/button'
import {speakItalian} from '@/lib/speech'
import {isAnswerCorrect} from '@/lib/utils'
import {VolumeHighIcon} from 'hugeicons-react'
import {useId, useState} from 'react'

interface ListeningExerciseProps {
  audioText: string
  answer: string
  revealed: boolean
  onSubmit: (correct: boolean) => void
  onContinue: () => void
  onSkipListening: () => void
}

export function ListeningExercise({
  audioText,
  answer,
  revealed,
  onSubmit,
  onContinue,
  onSkipListening
}: ListeningExerciseProps) {
  const [input, setInput] = useState('')
  const inputId = useId()

  const handleSubmit = () => {
    onSubmit(isAnswerCorrect(input, answer))
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <p className='text-muted-foreground mb-2 text-sm font-bold uppercase'>Listening exercise</p>
        <h2 className='text-xl font-black'>Type what you hear</h2>
      </div>

      <button
        type='button'
        aria-label='Play audio'
        onClick={() => speakItalian(audioText)}
        className='bg-primary focus-visible:ring-primary mx-auto flex h-24 w-24 items-center justify-center rounded-full text-white shadow-[0_6px_0_0_#46a302] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-1 active:shadow-none'
      >
        <VolumeHighIcon
          size={40}
          strokeWidth={2}
          aria-hidden
        />
      </button>

      <div>
        <label
          htmlFor={inputId}
          className='sr-only'
        >
          Type what you heard
        </label>
        <input
          id={inputId}
          type='text'
          value={input}
          disabled={revealed}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !revealed && handleSubmit()}
          placeholder='Type what you heard...'
          className='border-border focus:border-primary focus-visible:ring-primary w-full rounded-2xl border-2 px-6 py-4 text-lg font-bold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60'
        />
      </div>

      {revealed ? (
        <div className='space-y-4'>
          <p className='text-center font-bold'>
            Correct answer: <span className='text-primary'>{answer}</span>
          </p>
          <Button
            onClick={onContinue}
            className='w-full'
            size='lg'
          >
            Continue
          </Button>
        </div>
      ) : (
        <div className='space-y-3'>
          <Button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className='w-full'
            size='lg'
          >
            Check
          </Button>
          <Button
            onClick={onSkipListening}
            className='w-full'
            variant='outline'
            size='lg'
          >
            I cannot listen now
          </Button>
        </div>
      )}
    </div>
  )
}
