'use client'

import {accountDestructiveButtonClassName, accountSecondaryButtonClassName} from '@/components/account/accountStyles'
import {Dialog} from '@/components/ui/dialog'
import {useClerk, useUser} from '@clerk/nextjs'
import {isClerkAPIResponseError} from '@clerk/nextjs/errors'
import {useId, useState} from 'react'

function getClerkErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? 'Something went wrong.'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}

export function AccountDangerZone() {
  const {signOut} = useClerk()
  const {user} = useUser()
  const deleteTitleId = useId()
  const deleteDescriptionId = useId()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut({redirectUrl: '/sign-in'})
    } catch {
      setSigningOut(false)
    }
  }

  async function handleDeleteAccount() {
    if (!user) return

    setDeleting(true)
    setError(null)

    try {
      await user.delete()
      await signOut({redirectUrl: '/sign-in'})
    } catch (err) {
      setError(getClerkErrorMessage(err))
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={() => void handleSignOut()}
        disabled={signingOut}
        className={accountSecondaryButtonClassName}
      >
        {signingOut ? 'Signing out…' : 'Log out'}
      </button>

      <button
        type='button'
        onClick={() => {
          setError(null)
          setDeleteOpen(true)
        }}
        className='text-destructive hover:text-destructive/80 focus-visible:ring-destructive w-full text-sm font-bold tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      >
        Delete my account
      </button>

      <Dialog
        open={deleteOpen}
        titleId={deleteTitleId}
        descriptionId={deleteDescriptionId}
        onClose={() => {
          if (deleting) return
          setDeleteOpen(false)
          setError(null)
        }}
        closeOnBackdrop
        closeOnEscape={!deleting}
      >
        <div className='border-border bg-card w-full max-w-md space-y-5 rounded-3xl border-2 p-6 shadow-lg'>
          <div className='space-y-2'>
            <h2
              id={deleteTitleId}
              className='font-display text-foreground text-xl font-black'
            >
              Delete account?
            </h2>
            <p
              id={deleteDescriptionId}
              className='text-muted-foreground text-sm leading-relaxed'
            >
              This permanently deletes your account and all learning progress. This cannot be undone.
            </p>
          </div>

          {error ? (
            <p
              role='alert'
              className='text-destructive text-sm font-medium'
            >
              {error}
            </p>
          ) : null}

          <div className='flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              disabled={deleting}
              onClick={() => {
                setDeleteOpen(false)
                setError(null)
              }}
              className={accountSecondaryButtonClassName}
            >
              Cancel
            </button>
            <button
              type='button'
              disabled={deleting}
              onClick={() => void handleDeleteAccount()}
              className={accountDestructiveButtonClassName}
            >
              {deleting ? 'Deleting…' : 'Delete account'}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
