import {AppLogo} from '@/components/layout/AppLogo'
import {Card} from '@/components/ui/card'

interface StatusPageShellProps {
  children: React.ReactNode
}

export function StatusPageShell({children}: StatusPageShellProps) {
  return (
    <main className='bg-muted flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <Card className='space-y-6 text-center'>
          <AppLogo
            size='lg'
            href='/'
            className='mx-auto w-fit'
          />
          {children}
        </Card>
      </div>
    </main>
  )
}
