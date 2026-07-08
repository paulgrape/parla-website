'use client'

import {accountInputClassName, accountPrimaryButtonClassName} from '@/components/account/accountStyles'
import {useToast} from '@/components/providers/ToastProvider'
import {Card} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {useUser} from '@clerk/nextjs'
import {isClerkAPIResponseError} from '@clerk/nextjs/errors'
import {ViewIcon, ViewOffIcon} from 'hugeicons-react'
import {useId, useState} from 'react'

function getClerkErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? 'Something went wrong.'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}

export function PasswordForm() {
  const {toast} = useToast()
  const {user, isLoaded} = useUser()
  const currentPasswordId = useId()
  const newPasswordId = useId()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) {
    return (
      <Card aria-busy='true'>
        <p className='text-muted-foreground text-sm'>Loading security…</p>
      </Card>
    )
  }

  if (!user) return null

  const passwordEnabled = user.passwordEnabled

  if (!passwordEnabled) {
    return (
      <Card className='space-y-2'>
        <h2 className='text-lg font-bold'>Password</h2>
        <p className='text-muted-foreground text-sm'>
          You signed in with a social account. Password change is not available for this sign-in method.
        </p>
      </Card>
    )
  }

  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && !saving

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !canSubmit) return

    setSaving(true)
    setError(null)

    try {
      await user.updatePassword({
        currentPassword,
        newPassword
      })
      setCurrentPassword('')
      setNewPassword('')
      toast('Password updated.', 'success')
    } catch (err) {
      const errorMessage = getClerkErrorMessage(err)
      setError(errorMessage)
      toast(errorMessage, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <form
        className='space-y-5'
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className='text-lg font-bold'>Password</h2>
          <p className='text-muted-foreground text-sm'>Use at least 8 characters</p>
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={currentPasswordId}
            className='text-sm font-bold'
          >
            Current password
          </label>
          <div className='relative'>
            <input
              id={currentPasswordId}
              type={showCurrent ? 'text' : 'password'}
              autoComplete='current-password'
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              className={cn(accountInputClassName, 'pr-12')}
            />
            <button
              type='button'
              onClick={() => setShowCurrent(value => !value)}
              aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              className='text-muted-foreground hover:text-foreground focus-visible:ring-primary absolute inset-y-0 right-0 flex w-12 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              {showCurrent ? (
                <ViewOffIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <ViewIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                />
              )}
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={newPasswordId}
            className='text-sm font-bold'
          >
            New password
          </label>
          <div className='relative'>
            <input
              id={newPasswordId}
              type={showNew ? 'text' : 'password'}
              autoComplete='new-password'
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              className={cn(accountInputClassName, 'pr-12')}
            />
            <button
              type='button'
              onClick={() => setShowNew(value => !value)}
              aria-label={showNew ? 'Hide new password' : 'Show new password'}
              className='text-muted-foreground hover:text-foreground focus-visible:ring-primary absolute inset-y-0 right-0 flex w-12 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
            >
              {showNew ? (
                <ViewOffIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <ViewIcon
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                />
              )}
            </button>
          </div>
        </div>

        {error ? (
          <p
            role='alert'
            className='text-destructive text-sm font-medium'
          >
            {error}
          </p>
        ) : null}

        <button
          type='submit'
          disabled={!canSubmit}
          className={accountPrimaryButtonClassName}
        >
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </Card>
  )
}
