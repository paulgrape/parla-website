import {AuthLegalFooter} from '@/components/auth/AuthLegalFooter'
import {AppLogo} from '@/components/layout/AppLogo'
import {SignUp} from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className='bg-muted flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 w-full'>
          <AppLogo
            size='lg'
            titleAs='h1'
            href={false}
            centerTitle
            tagline='Start your Italian journey today'
          />
        </div>
        <div className='mx-auto w-fit'>
          <SignUp
            routing='path'
            path='/sign-up'
            signInUrl='/sign-in'
          />
        </div>
        <AuthLegalFooter />
      </div>
    </div>
  )
}
