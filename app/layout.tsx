import { AuthProvider } from '@/components/providers/AuthProvider'
import { SerwistProvider } from '@/components/providers/SerwistProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import './globals.css'

const APP_NAME = 'Parla'
const APP_DEFAULT_TITLE = 'Parla — Learn Italian'
const APP_DESCRIPTION =
  'Duolingo-style Italian language learning platform with spaced repetition'

const baloo2 = Baloo_2({
  variable: '--font-baloo2',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    { media: '(prefers-color-scheme: light)', color: '#58cc02' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${baloo2.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col bg-background'>
        <SerwistProvider swUrl='/serwist/sw.js'>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}
