import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-black text-primary'>Parla</h1>
          <p className='text-muted-foreground'>
            Learn Italian, one lesson at a time
          </p>
        </div>
        <SignIn
          routing='path'
          path='/sign-in'
          signUpUrl='/sign-up'
        />
      </div>
    </div>
  )
}
