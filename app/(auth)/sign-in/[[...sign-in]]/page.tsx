import {AuthLegalFooter} from '@/components/auth/AuthLegalFooter'
import {AppLogo} from '@/components/layout/AppLogo'
import {SignIn} from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='bg-muted flex min-h-screen items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 w-full'>
          <AppLogo
            size='lg'
            titleAs='h1'
            href={false}
            centerTitle
            tagline='Learn Italian, one lesson at a time'
          />
        </div>
        <div className='mx-auto w-fit'>
          <SignIn
            routing='path'
            path='/sign-in'
            signUpUrl='/sign-up'
          />
        </div>
        <AuthLegalFooter />
      </div>
    </div>
  )
}
