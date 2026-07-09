'use client'

import {CurrentLessonIcon} from '@/components/dashboard/CurrentLessonIcon'
import {SectionCompleteBanner} from '@/components/dashboard/SectionCompleteBanner'
import {StreakAtRiskBanner} from '@/components/dashboard/StreakAtRiskBanner'
import {StreakCard} from '@/components/dashboard/StreakCard'
import {XpBar} from '@/components/dashboard/XpBar'
import {CorrectBurst} from '@/components/lesson/CorrectBurst'
import {HeartBar} from '@/components/lesson/HeartBar'
import {LevelUpScreen} from '@/components/lesson/LevelUpScreen'
import {TranslationExercise, XpPop} from '@/components/lesson/exercises/TranslationExercise'
import {ToastProvider, useToast} from '@/components/providers/ToastProvider'
import {ReviewComplete} from '@/components/review/ReviewComplete'
import {REVIEW_CARD_EXIT_MS, ReviewFlashcard} from '@/components/review/ReviewFlashcard'
import {AccordionItem} from '@/components/ui/Accordion'
import {Button} from '@/components/ui/button'
import {useReducedMotion} from '@/hooks/useReducedMotion'
import {AnimatePresence} from 'framer-motion'
import {StarIcon} from 'hugeicons-react'
import {useState} from 'react'

const DEMO_REVIEW_ITEM = {
  id: 'demo-review-1',
  vocabularyId: 'demo-vocab-1',
  italian: 'ciao',
  english: 'hello',
  interval: 1,
  easeFactor: 2.5,
  repetitions: 0
}

function MotionPlaygroundInner() {
  const {toast} = useToast()
  const reducedMotion = useReducedMotion()
  const [lives, setLives] = useState(5)
  const [flipped, setFlipped] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showXpPop, setShowXpPop] = useState(false)
  const [translationRevealed, setTranslationRevealed] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [demoXp, setDemoXp] = useState(40)
  const [demoStreak, setDemoStreak] = useState(3)
  const [showBurst, setShowBurst] = useState(false)

  const triggerCardExit = () => {
    setExiting(true)
    window.setTimeout(
      () => {
        setExiting(false)
        setFlipped(false)
      },
      reducedMotion ? 0 : REVIEW_CARD_EXIT_MS
    )
  }

  const triggerXpPop = () => {
    setShowXpPop(true)
    window.setTimeout(() => setShowXpPop(false), reducedMotion ? 0 : 1000)
  }

  return (
    <div
      className='bg-background text-foreground mx-auto max-w-2xl space-y-12 p-6 md:p-10'
      data-testid='motion-playground'
    >
      <header className='space-y-2'>
        <h1 className='font-display text-3xl font-black'>Motion playground</h1>
        <p className='text-muted-foreground text-sm'>Dev-only page for e2e motion screenshots.</p>
      </header>

      <section
        className='space-y-4'
        data-testid='heart-bar-section'
      >
        <h2 className='text-xl font-black'>Heart loss</h2>
        <div className='flex items-center gap-4'>
          <HeartBar
            lives={lives}
            maxLives={5}
          />
          <Button
            data-testid='heart-bar-lose'
            variant='outline'
            size='sm'
            disabled={lives <= 0}
            onClick={() => setLives(current => Math.max(0, current - 1))}
          >
            Lose heart
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setLives(5)}
          >
            Reset
          </Button>
        </div>
      </section>

      <section
        className='space-y-4'
        data-testid='current-node-section'
      >
        <h2 className='text-xl font-black'>Current lesson node</h2>
        <button
          type='button'
          data-testid='current-lesson-node'
          className='border-primary-dark bg-card text-primary flex h-16 w-16 items-center justify-center rounded-full border-4 font-bold shadow-[0_8px_0_0_#46a302] transition-all duration-100 hover:translate-y-1 hover:shadow-[0_4px_0_0_#46a302] active:translate-y-2 active:shadow-none'
        >
          <CurrentLessonIcon animate={!reducedMotion}>
            <StarIcon
              size={26}
              strokeWidth={2}
              aria-hidden
            />
          </CurrentLessonIcon>
        </button>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-black'>Review flashcard</h2>
        <AnimatePresence mode='wait'>
          <ReviewFlashcard
            key={exiting ? 'exiting' : 'idle'}
            item={DEMO_REVIEW_ITEM}
            flipped={flipped}
            exiting={exiting}
            onFlip={() => !exiting && setFlipped(open => !open)}
          />
        </AnimatePresence>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={triggerCardExit}
          >
            Trigger card exit
          </Button>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-black'>Review complete</h2>
        <ReviewComplete onBack={() => undefined} />
      </section>

      <section
        className='space-y-4'
        data-testid='section-complete-section'
      >
        <h2 className='text-xl font-black'>Section complete</h2>
        <SectionCompleteBanner sectionTitle='Greetings' />
      </section>

      <section
        className='space-y-4'
        data-testid='streak-at-risk-section'
      >
        <h2 className='text-xl font-black'>Streak at risk</h2>
        <StreakAtRiskBanner streak={7} />
      </section>

      <section
        className='space-y-4'
        data-testid='xp-bar-section'
      >
        <h2 className='text-xl font-black'>XP bar celebrate</h2>
        <XpBar xp={demoXp} />
        <Button
          data-testid='xp-bar-add'
          variant='outline'
          size='sm'
          onClick={() => setDemoXp(current => current + 15)}
        >
          Gain XP
        </Button>
      </section>

      <section
        className='space-y-4'
        data-testid='streak-countup-section'
      >
        <h2 className='text-xl font-black'>Streak count-up</h2>
        <StreakCard
          streak={demoStreak}
          longestStreak={12}
        />
        <Button
          data-testid='streak-add'
          variant='outline'
          size='sm'
          onClick={() => setDemoStreak(current => current + 1)}
        >
          Add day
        </Button>
      </section>

      <section
        className='space-y-4'
        data-testid='correct-burst-section'
      >
        <h2 className='text-xl font-black'>Correct burst</h2>
        <div className='flex items-center gap-4'>
          <div className='bg-primary/15 relative flex h-12 w-12 items-center justify-center rounded-full'>
            <CorrectBurst show={showBurst} />
            <span className='text-primary text-lg font-black'>✓</span>
          </div>
          <Button
            data-testid='correct-burst-trigger'
            variant='outline'
            size='sm'
            onClick={() => {
              setShowBurst(false)
              window.requestAnimationFrame(() => setShowBurst(true))
              window.setTimeout(() => setShowBurst(false), reducedMotion ? 0 : 600)
            }}
          >
            Fire burst
          </Button>
        </div>
      </section>

      <section
        className='space-y-4'
        data-testid='accordion-section'
      >
        <h2 className='text-xl font-black'>Accordion</h2>
        <div className='border-border rounded-2xl border-2 px-4'>
          <AccordionItem title='Why Italian rhyme?'>
            <p className='text-muted-foreground text-sm'>Because oaths sound cooler in streaming vowels.</p>
          </AccordionItem>
          <AccordionItem title='How streaks work'>
            <p className='text-muted-foreground text-sm'>Finish one lesson per day. Evening banner warns if late.</p>
          </AccordionItem>
        </div>
      </section>

      <section
        className='space-y-4'
        data-testid='toast-section'
      >
        <h2 className='text-xl font-black'>Toast</h2>
        <div className='flex gap-2'>
          <Button
            data-testid='toast-success'
            size='sm'
            onClick={() => toast('Profile saved.', 'success')}
          >
            Success toast
          </Button>
          <Button
            data-testid='toast-error'
            size='sm'
            variant='outline'
            onClick={() => toast('Something went wrong.', 'error')}
          >
            Error toast
          </Button>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-black'>XP pop</h2>
        <div
          className='relative flex h-24 items-center justify-center rounded-2xl border-2 border-dashed'
          data-testid='xp-pop-stage'
        >
          <XpPop show={showXpPop} />
          <Button
            data-testid='xp-pop-trigger'
            onClick={triggerXpPop}
          >
            Show +10 XP
          </Button>
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-black'>New word tooltip</h2>
        <TranslationExercise
          prompt='grazie'
          options={['thanks', 'please', 'sorry', 'hello']}
          selected={selected}
          revealed={translationRevealed}
          correctAnswer='thanks'
          isNew
          onSelect={setSelected}
          onCheck={() => setTranslationRevealed(true)}
        />
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-black'>Level up screen</h2>
        <Button
          data-testid='show-level-up'
          onClick={() => setShowLevelUp(true)}
        >
          Show level up
        </Button>
        {showLevelUp && (
          <LevelUpScreen
            level={3}
            onContinue={() => setShowLevelUp(false)}
          />
        )}
      </section>
    </div>
  )
}

export function MotionPlayground() {
  return (
    <ToastProvider>
      <MotionPlaygroundInner />
    </ToastProvider>
  )
}
