import {
  ParlaReturnNav,
  ParlaReturnNavFallback,
} from '@/components/layout/ParlaReturnNav'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms that govern your use of ${APP_NAME}, a non-commercial Italian learning app by Pavel Vinogradov.`,
}

const LAST_UPDATED = 'July 4, 2026'
const CONTACT_EMAIL = 'vin.pavel13@gmail.com'

const sectionHeadingClassName =
  'text-sm font-black uppercase tracking-wide text-primary'

export default function TermsPage() {
  return (
    <main className='min-h-screen bg-muted p-4 py-10'>
      <div className='mx-auto max-w-2xl space-y-6'>
        <Suspense fallback={<ParlaReturnNavFallback />}>
          <ParlaReturnNav />
        </Suspense>

        <Card className='space-y-8'>
          <header>
            <h1 className='text-3xl font-black font-display text-primary'>
              Terms of Service
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <section
            aria-labelledby='acceptance-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='acceptance-heading'
              className={sectionHeadingClassName}
            >
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using {APP_NAME} (the &ldquo;app&rdquo;), you agree to
              these Terms of Service. If you do not agree, please do not use the
              app. These terms apply to everyone who uses {APP_NAME}.
            </p>
          </section>

          <section
            aria-labelledby='about-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='about-heading'
              className={sectionHeadingClassName}
            >
              About {APP_NAME}
            </h2>
            <p>
              {APP_NAME} is a non-commercial, personal project built for learning
              Italian. It is offered free of charge, with no ads, subscriptions,
              or payments of any kind. {APP_NAME} is inspired by Duolingo but is not
              affiliated with, endorsed by, or connected to Duolingo or any
              other commercial language platform.
            </p>
          </section>

          <section
            aria-labelledby='eligibility-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='eligibility-heading'
              className={sectionHeadingClassName}
            >
              Eligibility
            </h2>
            <p>
              You must be at least 13 years old to use {APP_NAME}. If you are under
              the age of majority where you live, you may use {APP_NAME} only with
              the involvement and consent of a parent or guardian.
            </p>
          </section>

          <section
            aria-labelledby='account-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='account-heading'
              className={sectionHeadingClassName}
            >
              Your Account
            </h2>
            <p>
              Signing in to {APP_NAME} is handled by Clerk, a third-party
              authentication provider. You are responsible for keeping your
              account credentials secure and for any activity that happens under
              your account. Please provide accurate information when you
              register, and let us know if you believe your account has been
              compromised.
            </p>
          </section>

          <section
            aria-labelledby='acceptable-use-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='acceptable-use-heading'
              className={sectionHeadingClassName}
            >
              Acceptable Use
            </h2>
            <p>When using {APP_NAME}, you agree not to:</p>
            <ul className='list-disc space-y-2 pl-5 marker:text-primary'>
              <li>
                Disrupt, overload, or interfere with the app or its
                infrastructure.
              </li>
              <li>
                Attempt to gain unauthorized access to accounts, systems, or
                data.
              </li>
              <li>
                Scrape, copy, or reverse-engineer the app except where the law
                expressly permits it.
              </li>
              <li>Use {APP_NAME} for any unlawful, harmful, or abusive purpose.</li>
            </ul>
          </section>

          <section
            aria-labelledby='ip-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='ip-heading'
              className={sectionHeadingClassName}
            >
              Intellectual Property
            </h2>
            <p>
              The design, code, and original content of {APP_NAME} belong to the
              developer. You are welcome to use the learning content for your
              own personal, non-commercial study. All trademarks, names, and
              brands referenced in the app remain the property of their
              respective owners.
            </p>
          </section>

          <section
            aria-labelledby='disclaimer-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='disclaimer-heading'
              className={sectionHeadingClassName}
            >
              Educational Disclaimer
            </h2>
            <p>
              {APP_NAME} is a learning aid, not a certified course. While the content
              is prepared with care, it may contain mistakes, and no outcome
              &mdash; such as fluency or a particular level of proficiency
              &mdash; is guaranteed. Always cross-check important language use
              with a qualified teacher or authoritative source.
            </p>
          </section>

          <section
            aria-labelledby='availability-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='availability-heading'
              className={sectionHeadingClassName}
            >
              Service Availability
            </h2>
            <p>
              {APP_NAME} is provided &ldquo;as is&rdquo; and &ldquo;as
              available.&rdquo; As a personal project, it may change, pause, or
              be discontinued at any time, and features may be added or removed
              without notice. We do not promise that the app will always be
              available, uninterrupted, or error-free.
            </p>
          </section>

          <section
            aria-labelledby='liability-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='liability-heading'
              className={sectionHeadingClassName}
            >
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, the developer is not
              liable for any indirect, incidental, or consequential damages
              arising from your use of, or inability to use, {APP_NAME}. Because the
              app is free and non-commercial, you use it at your own discretion
              and risk.
            </p>
          </section>

          <section
            aria-labelledby='changes-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='changes-heading'
              className={sectionHeadingClassName}
            >
              Changes to These Terms
            </h2>
            <p>
              These terms may be updated from time to time. When they change,
              the &ldquo;Last updated&rdquo; date at the top of this page will
              be revised. Continued use of {APP_NAME} after an update means you
              accept the revised terms.
            </p>
          </section>

          <section
            aria-labelledby='law-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='law-heading'
              className={sectionHeadingClassName}
            >
              Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the developer&apos;s
              country of residence, without regard to conflict-of-law rules, to
              the extent permitted by applicable local law.
            </p>
          </section>

          <section
            aria-labelledby='contact-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='contact-heading'
              className={sectionHeadingClassName}
            >
              Contact
            </h2>
            <p>
              Questions about these terms? Reach out at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className='font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <p className='text-sm text-muted-foreground'>
              {APP_NAME} is a personal, non-commercial project. This page is a
              good-faith summary of how the app works and is not formal legal
              advice.
            </p>
          </section>
        </Card>
      </div>
    </main>
  )
}
