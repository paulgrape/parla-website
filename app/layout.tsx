import {AuthProvider} from '@/components/providers/AuthProvider'
import {MotionProvider} from '@/components/providers/MotionProvider'
import {SerwistProvider} from '@/components/providers/SerwistProvider'
import {ThemeProvider} from '@/components/providers/ThemeProvider'
import {APP_DEFAULT_TITLE, APP_DESCRIPTION, APP_NAME} from '@/lib/constants'
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
    title: APP_NAME,
    startupImage: [
      // iPhone 11 / XR — standard display
      {
        url: '/splash/iphone11-portrait-light.jpg',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/splash/iphone11-portrait-dark.jpg',
        media:
          'screen and (prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/splash/iphone11-landscape-light.jpg',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      {
        url: '/splash/iphone11-landscape-dark.jpg',
        media:
          'screen and (prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
      },
      // iPhone 11 / XR — Display Zoom (Settings → Display & Brightness → Display Zoom → Zoomed)
      {
        url: '/splash/iphone11-zoomed-light.jpg',
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      },
      {
        url: '/splash/iphone11-zoomed-dark.jpg',
        media:
          'screen and (prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
      }
    ]
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
      <body className='bg-background flex min-h-full flex-col'>
        <SerwistProvider swUrl='/serwist/sw.js'>
          <ThemeProvider>
            <MotionProvider>
              <AuthProvider>{children}</AuthProvider>
            </MotionProvider>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}
