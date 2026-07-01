'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Tick01Icon } from 'hugeicons-react'
import { useMemo, useState } from 'react'

interface MatchExerciseProps {
  answer: string
  onMistake: () => void
  onComplete: () => void
}

interface Pair {
  italian: string
  english: string
}

type Side = 'it' | 'en'

interface Selection {
  side: Side
  word: string
}

function parsePairs(answer: string): Pair[] {
  const parsed = JSON.parse(answer) as unknown
  if (!Array.isArray(parsed)) return []

  return parsed
    .map(item => {
      if (Array.isArray(item) && item.length >= 2) {
        return { italian: String(item[0]), english: String(item[1]) }
      }
      if (
        item &&
        typeof item === 'object' &&
        'italian' in item &&
        'english' in item
      ) {
        const pair = item as { italian: string; english: string }
        return { italian: pair.italian, english: pair.english }
      }
      return { italian: '', english: '' }
    })
    .filter(p => p.italian && p.english)
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export function MatchExercise({
  answer,
  onMistake,
  onComplete,
}: MatchExerciseProps) {
  const pairs: Pair[] = useMemo(() => parsePairs(answer), [answer])
  const [selection, setSelection] = useState<Selection | null>(null)
  const [matchedItalian, setMatchedItalian] = useState<Set<string>>(new Set())
  const [matchedEnglish, setMatchedEnglish] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState<Selection | null>(null)
  const [wrongAnnouncement, setWrongAnnouncement] = useState('')
  const [italianWords] = useState<string[]>(() =>
    shuffle(pairs.map(p => p.italian)),
  )
  const [englishWords] = useState<string[]>(() =>
    shuffle(pairs.map(p => p.english)),
  )

  const allMatched = matchedItalian.size === pairs.length && pairs.length > 0

  const isMatched = (side: Side, word: string) =>
    side === 'it' ? matchedItalian.has(word) : matchedEnglish.has(word)

  const resolvePair = (a: Selection, b: Selection) => {
    const italian = a.side === 'it' ? a.word : b.word
    const english = a.side === 'en' ? a.word : b.word
    return { italian, english }
  }

  const handleSelect = (side: Side, word: string) => {
    if (isMatched(side, word)) return

    // First pick, or re-picking within the same column.
    if (!selection || selection.side === side) {
      setSelection({ side, word })
      setWrong(null)
      return
    }

    // Second pick from the other column: evaluate the pair.
    const { italian, english } = resolvePair(selection, { side, word })
    const isPair = pairs.some(
      p => p.italian === italian && p.english === english,
    )

    if (isPair) {
      // Completion is confirmed via the Continue button, not auto-advanced.
      setMatchedItalian(prev => new Set(prev).add(italian))
      setMatchedEnglish(prev => new Set(prev).add(english))
      setSelection(null)
    } else {
      onMistake()
      setWrong({ side, word })
      setWrongAnnouncement('Incorrect match. Try again.')
      setSelection(null)
      setTimeout(() => {
        setWrong(null)
        setWrongAnnouncement('')
      }, 500)
    }
  }

  const renderColumn = (side: Side, words: string[]) => (
    <div className='flex flex-col gap-2'>
      {words.map(word => {
        const matched = isMatched(side, word)
        const selected = selection?.side === side && selection.word === word
        const isWrong = wrong?.side === side && wrong.word === word

        return (
          <button
            key={word}
            disabled={matched || allMatched}
            onClick={() => handleSelect(side, word)}
            className={cn(
              'flex min-h-16 items-center justify-between rounded-2xl border-2 px-4 py-5 font-bold transition-all',
              matched && 'border-primary bg-primary/10 text-primary',
              selected && !matched && 'border-primary bg-primary/10',
              isWrong && 'border-destructive animate-shake',
              !matched &&
                !selected &&
                !isWrong &&
                'border-border hover:border-primary',
            )}
          >
            <span>{word}</span>
            {matched && (
              <Tick01Icon
                size={18}
                strokeWidth={2.5}
              />
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className='flex flex-col gap-8'>
      <div
        aria-live='polite'
        className='sr-only'
      >
        {wrongAnnouncement}
      </div>
      <div>
        <p className='text-sm font-bold uppercase text-muted-foreground mb-2'>
          Match the pairs
        </p>
        <h2 className='text-xl font-black'>Tap one from each column</h2>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {renderColumn('it', italianWords)}
        {renderColumn('en', englishWords)}
      </div>

      <Button
        onClick={onComplete}
        disabled={!allMatched}
        className='w-full'
        size='lg'
      >
        Continue
      </Button>
    </div>
  )
}
