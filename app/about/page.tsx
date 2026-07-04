import { AppLogo } from '@/components/layout/AppLogo'
import { Card } from '@/components/ui/card'
import type { Metadata } from 'next'
import { ArrowLeft01Icon } from 'hugeicons-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Parla is a non-commercial Italian learning app by Pavel Vinogradov, inspired by Duolingo and built with love for the language.',
}

const sectionHeadingClassName =
  'text-sm font-black uppercase tracking-wide text-primary'

export default function AboutPage() {
  return (
    <main className='min-h-screen bg-muted p-4 py-10'>
      <div className='mx-auto max-w-2xl space-y-6'>
        <Link
          href='/'
          className='inline-flex items-center gap-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-2 py-1'
        >
          <ArrowLeft01Icon
            size={18}
            strokeWidth={2}
            aria-hidden
          />
          Back to Parla
        </Link>

        <AppLogo size='md' href='/' />

        <Card className='space-y-8'>
          <header>
            <h1 className='text-3xl font-black font-display text-primary'>
              About Parla
            </h1>
            <p className='mt-2 text-muted-foreground'>
              A personal, non-commercial Italian learning app.
            </p>
          </header>

          <section
            aria-labelledby='about-parla-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2 id='about-parla-heading' className={sectionHeadingClassName}>
              About Parla
            </h2>
            <p>
              Parla is a non-commercial, personal project built out of love for
              the Italian language. I started it because I wanted a focused
              place to practice every day — not another generic app, but
              something shaped around how I actually learn: short sessions,
              steady progress, and plenty of repetition until phrases stick.
            </p>
            <p>
              The experience is inspired by Duolingo — playful, bite-sized
              lessons, hearts, streaks, and that satisfying feeling of clearing
              a level — but Parla is my own take. I kept the parts that motivate
              me and stripped away what I did not need, so the app stays lean and
              centered on Italian.
            </p>
          </section>

          <section
            aria-labelledby='features-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2 id='features-heading' className={sectionHeadingClassName}>
              What you&apos;ll find
            </h2>
            <p>
              Structured sections and lessons, a review mode for spaced
              repetition, audio for pronunciation, and a guidebook to revisit
              grammar and vocabulary from each unit. It is the kind of tool I
              wished I had while traveling: something I could open for ten
              minutes on the train and still feel I moved forward.
            </p>
          </section>

          <section
            aria-labelledby='author-heading'
            className='flow-root space-y-4 leading-relaxed text-foreground'
          >
            <h2 id='author-heading' className={sectionHeadingClassName}>
              About me
            </h2>
            <p className='text-lg font-bold'>Pavel Vinogradov</p>
            <p className='-mt-3 text-sm text-muted-foreground'>
              Senior Frontend Developer
            </p>

            <figure className='mx-auto w-40 sm:mx-0 sm:float-left sm:mr-5 sm:mb-2'>
              <div className='overflow-hidden rounded-2xl border-2 border-border'>
                <Image
                  src='/avatar-full.jpg'
                  alt='Pavel Vinogradov'
                  width={160}
                  height={200}
                  className='aspect-4/5 w-full object-cover object-top'
                />
              </div>
              <figcaption className='mt-2 text-center text-xs text-muted-foreground'>
                Rome, 2025
              </figcaption>
            </figure>

            <p>
              I am a senior frontend developer based in Europe. Building Parla
              lets me combine the craft I work with every day — React, Next.js,
              thoughtful UI — with a language I care about deeply. Italy, its
              culture, and its way of expressing ideas drew me in long before
              this app existed; Rome in 2025 was a reminder of why I keep going
              back to the language.
            </p>
          </section>

          <section
            aria-labelledby='disclaimer-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2 id='disclaimer-heading' className={sectionHeadingClassName}>
              Disclaimer
            </h2>
            <p>
              Parla is not affiliated with Duolingo or any commercial language
              platform. There are no ads, no subscriptions, and no plan to turn
              it into a product. It exists to learn, experiment, and share
              something useful with fellow Italian learners — and to keep my own
              practice honest.
            </p>
            <p>
              If you are using Parla, grazie. I hope it helps you as much as
              building it helps me. Buon apprendimento.
            </p>
          </section>
        </Card>
      </div>
    </main>
  )
}
