import {AuthProvider} from '@/components/providers/AuthProvider'
import {MotionProvider} from '@/components/providers/MotionProvider'
import {SerwistProvider} from '@/components/providers/SerwistProvider'
import {ThemeProvider} from '@/components/providers/ThemeProvider'
import {IOSInstallPrompt} from '@/components/pwa/IOSInstallPrompt'
import {APP_DEFAULT_TITLE, APP_DESCRIPTION, APP_NAME} from '@/lib/constants'
import {IOS_SPLASH_SCREENS} from '@/lib/ios-splash-screens'
import type {Metadata, Viewport} from 'next'
import {Baloo_2, Nunito} from 'next/font/google'

import './globals.css'

const baloo2 = Baloo_2({
  variable: '--font-baloo2',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
})

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: `%s — ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME
  },
  formatDetection: {
    telephone: false
  }
}

export const viewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: dark)', color: '#0f0f0f'},
    {media: '(prefers-color-scheme: light)', color: '#58cc02'}
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${baloo2.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* iOS still requires this legacy meta for standalone + splash screens */}
        <meta
          name='apple-mobile-web-app-capable'
          content='yes'
        />
        {IOS_SPLASH_SCREENS.map(({href, media}) => (
          <link
            key={media}
            rel='apple-touch-startup-image'
            href={href}
            media={media}
          />
        ))}
      </head>
      <body className='bg-background flex min-h-full flex-col'>
        <SerwistProvider swUrl='/serwist/sw.js'>
          <ThemeProvider>
            <MotionProvider>
              <AuthProvider>
                {children}
                <IOSInstallPrompt />
              </AuthProvider>
            </MotionProvider>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}
