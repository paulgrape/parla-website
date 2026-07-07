import {clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'

const SIGN_IN_URL = '/sign-in'
const SIGN_UP_URL = '/sign-up'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/terms(.*)',
  '/privacy(.*)',
  '/about(.*)',
  '/api/webhooks(.*)',
  '/~offline'
])

const hasClerk = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default hasClerk
  ? clerkMiddleware(
      async (auth, request) => {
        if (!isPublicRoute(request)) {
          await auth.protect({unauthenticatedUrl: SIGN_IN_URL})
        }
      },
      {signInUrl: SIGN_IN_URL, signUpUrl: SIGN_UP_URL}
    )
  : () => {}

export const config = {
  matcher: [
    '/((?!_next|serwist|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
