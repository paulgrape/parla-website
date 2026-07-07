import {MobileNav} from '@/components/layout/MobileNav'
import {RightAside} from '@/components/layout/RightAside'
import {Sidebar} from '@/components/layout/Sidebar'
import {TopBar} from '@/components/layout/TopBar'
import {SoundPreloader} from '@/components/providers/SoundPreloader'
import {UserStatsProvider} from '@/components/providers/UserStatsProvider'

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <UserStatsProvider>
      <SoundPreloader />
      <a
        href='#main-content'
        className='focus:bg-primary focus:text-primary-foreground focus:ring-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:px-4 focus:py-2 focus:font-bold focus:ring-2 focus:ring-offset-2 focus:outline-none'
      >
        Skip to main content
      </a>
      <div
        id='app-shell'
        className='mx-auto flex min-h-screen w-full max-w-300 justify-center'
      >
        <Sidebar />
        <div className='flex w-full max-w-2xl flex-col'>
          <TopBar />
          <main
            id='main-content'
            className='flex-1 p-4 pb-24 md:px-8 md:pb-8'
          >
            {children}
          </main>
        </div>
        <RightAside />
        <MobileNav />
      </div>
    </UserStatsProvider>
  )
}
