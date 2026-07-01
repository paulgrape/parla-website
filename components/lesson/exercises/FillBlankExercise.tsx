'use client'

import { Button } from '@/components/ui/button'
import { isAnswerCorrect } from '@/lib/utils'
import { useId, useState } from 'react'

interface FillBlankExerciseProps {
  prompt: string
  answer: string
  revealed: boolean
  onSubmit: (correct: boolean) => void
  onContinue: () => void
}

export function FillBlankExercise({
  prompt,
  answer,
  revealed,
  onSubmit,
  onContinue,
}: FillBlankExerciseProps) {
  const [input, setInput] = useState('')
  const inputId = useId()

  const handleSubmit = () => {
    onSubmit(isAnswerCorrect(input, answer))
  }

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <p className='text-sm font-bold uppercase text-muted-foreground mb-2'>
          Fill in the blank
        </p>
        <h2 className='text-2xl font-black'>{prompt}</h2>
      </div>

      <div>
        <label
          htmlFor={inputId}
          className='sr-only'
        >
          Your answer
        </label>
        <input
          id={inputId}
          type='text'
          value={input}
          disabled={revealed}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !revealed && handleSubmit()}
          placeholder='Type your answer...'
          className='w-full rounded-2xl border-2 border-border px-6 py-4 text-lg font-bold focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60'
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
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className='w-full'
          size='lg'
        >
          Check
        </Button>
      )}
    </div>
  )
}
