import {
  ParlaReturnNav,
  ParlaReturnNavFallback,
} from '@/components/layout/ParlaReturnNav'
import { Card } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${APP_NAME}, a non-commercial Italian learning app by Pavel Vinogradov, collects and handles your data.`,
}

const LAST_UPDATED = 'July 4, 2026'
const CONTACT_EMAIL = 'vin.pavel13@gmail.com'

const sectionHeadingClassName =
  'text-sm font-black uppercase tracking-wide text-primary'

export default function PrivacyPage() {
  return (
    <main className='min-h-screen bg-muted p-4 py-10'>
      <div className='mx-auto max-w-2xl space-y-6'>
        <Suspense fallback={<ParlaReturnNavFallback />}>
          <ParlaReturnNav />
        </Suspense>

        <Card className='space-y-8'>
          <header>
            <h1 className='text-3xl font-black font-display text-primary'>
              Privacy Policy
            </h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Last updated: {LAST_UPDATED}
            </p>
          </header>

          <section
            aria-labelledby='overview-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='overview-heading'
              className={sectionHeadingClassName}
            >
              Overview
            </h2>
            <p>
              {APP_NAME} is a non-commercial, personal Italian learning project. It
              collects the minimum needed to run the app and track your learning
              progress. {APP_NAME} does not sell your data, does not show ads, and
              does not use advertising or tracking cookies.
            </p>
          </section>

          <section
            aria-labelledby='collect-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='collect-heading'
              className={sectionHeadingClassName}
            >
              Information We Collect
            </h2>
            <ul className='list-disc space-y-2 pl-5 marker:text-primary'>
              <li>
                <span className='font-bold'>Account information</span> &mdash;
                your username and email address, provided through Clerk when you
                sign in.
              </li>
              <li>
                <span className='font-bold'>Learning progress</span> &mdash;
                completed lessons, XP earned, daily streaks, hearts, words you
                have seen, and spaced-repetition review data.
              </li>
              <li>
                <span className='font-bold'>Basic technical data</span> &mdash;
                standard log and connection data (such as IP address) that our
                hosting and infrastructure providers process to serve and secure
                the app.
              </li>
            </ul>
          </section>

          <section
            aria-labelledby='use-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='use-heading'
              className={sectionHeadingClassName}
            >
              How We Use Information
            </h2>
            <p>We use your information to:</p>
            <ul className='list-disc space-y-2 pl-5 marker:text-primary'>
              <li>Provide the app and sign you in to your account.</li>
              <li>Save and display your learning progress across sessions.</li>
              <li>
                Keep the app running, secure, and working the way it should.
              </li>
            </ul>
            <p>
              We do not use your data for advertising, profiling, or selling to
              third parties.
            </p>
          </section>

          <section
            aria-labelledby='providers-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='providers-heading'
              className={sectionHeadingClassName}
            >
              Service Providers
            </h2>
            <p>
              {APP_NAME} relies on a few trusted providers to operate. Your data may
              be processed by them solely to run the app:
            </p>
            <ul className='list-disc space-y-2 pl-5 marker:text-primary'>
              <li>
                <span className='font-bold'>Clerk</span> &mdash; authentication
                and account management.
              </li>
              <li>
                <span className='font-bold'>Neon</span> &mdash; the database
                that stores your progress.
              </li>
              <li>
                <span className='font-bold'>Cloudflare</span> &mdash; runs the
                app&apos;s API.
              </li>
              <li>
                <span className='font-bold'>Vercel</span> &mdash; hosts the web
                app.
              </li>
            </ul>
            <p>
              Each provider handles data under its own privacy policy and
              security practices.
            </p>
          </section>

          <section
            aria-labelledby='cookies-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='cookies-heading'
              className={sectionHeadingClassName}
            >
              Cookies &amp; Local Storage
            </h2>
            <p>
              {APP_NAME} uses only essential cookies and local storage &mdash; mainly
              the authentication session cookies set by Clerk to keep you signed
              in. There are no advertising or analytics tracking cookies, so no
              cookie-consent banner is required.
            </p>
          </section>

          <section
            aria-labelledby='retention-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='retention-heading'
              className={sectionHeadingClassName}
            >
              Data Retention
            </h2>
            <p>
              We keep your account and progress data for as long as your account
              is active. If you ask us to delete your account, your associated
              data is removed, except where we are required to keep some
              information to comply with the law.
            </p>
          </section>

          <section
            aria-labelledby='rights-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='rights-heading'
              className={sectionHeadingClassName}
            >
              Your Rights
            </h2>
            <p>
              Depending on where you live (for example, under the GDPR or CCPA),
              you may have the right to access, correct, export, or delete your
              personal data, and to object to certain processing. To make any of
              these requests, contact us at{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className='font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm'
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section
            aria-labelledby='children-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='children-heading'
              className={sectionHeadingClassName}
            >
              Children&apos;s Privacy
            </h2>
            <p>
              {APP_NAME} is not directed at children under 13, and we do not
              knowingly collect personal data from them. If you believe a child
              has provided us with personal data, please contact us and we will
              delete it.
            </p>
          </section>

          <section
            aria-labelledby='security-heading'
            className='space-y-4 leading-relaxed text-foreground'
          >
            <h2
              id='security-heading'
              className={sectionHeadingClassName}
            >
              Data Security
            </h2>
            <p>
              We take reasonable measures to protect your data and rely on
              established providers for authentication, hosting, and storage. No
              method of transmission or storage is completely secure, however,
              so we cannot guarantee absolute security.
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
              Changes to This Policy
            </h2>
            <p>
              This policy may be updated from time to time. When it changes, the
              &ldquo;Last updated&rdquo; date at the top of this page will be
              revised.
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
              Questions about your privacy or this policy? Reach out at{' '}
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
              good-faith summary of how the app handles data and is not formal
              legal advice.
            </p>
          </section>
        </Card>
      </div>
    </main>
  )
}
