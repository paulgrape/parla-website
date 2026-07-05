'use client'

import {
  accountInputClassName,
  accountPrimaryButtonClassName,
} from '@/components/account/accountStyles'
import { Card } from '@/components/ui/card'
import { checkProfileNames } from '@/lib/nameModeration'
import { cn } from '@/lib/utils'
import { useReverification, useUser } from '@clerk/nextjs'
import {
  isClerkAPIResponseError,
  isReverificationCancelledError,
} from '@clerk/nextjs/errors'
import type { UserResource } from '@clerk/types'
import { Edit02Icon } from 'hugeicons-react'
import { useId, useRef, useState } from 'react'

function getClerkErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    return error.errors[0]?.longMessage ?? error.errors[0]?.message ?? 'Something went wrong.'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}

function ProfileFormFields({ user }: { user: UserResource }) {
  const avatarInputId = useId()
  const firstNameId = useId()
  const lastNameId = useId()
  const usernameId = useId()
  const emailId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState(user.firstName ?? '')
  const [lastName, setLastName] = useState(user.lastName ?? '')
  const [username, setUsername] = useState(user.username ?? '')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useReverification(
    (params: {
      firstName?: string
      lastName?: string
      username?: string
    }) => user.update(params),
  )

  const email = user.primaryEmailAddress?.emailAddress ?? ''
  const emailVerified =
    user.primaryEmailAddress?.verification?.status === 'verified'
  const isDirty =
    firstName !== (user.firstName ?? '') ||
    lastName !== (user.lastName ?? '') ||
    username !== (user.username ?? '')

  async function handleAvatarChange(file: File) {
    setUploadingAvatar(true)
    setError(null)
    setMessage(null)
    try {
      await user.setProfileImage({ file })
      setMessage('Profile photo updated.')
    } catch (err) {
      setError(getClerkErrorMessage(err))
    } finally {
      setUploadingAvatar(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isDirty) return

    const nameCheck = checkProfileNames({ firstName, lastName, username })
    if (!nameCheck.ok) {
      setError(nameCheck.reason)
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const updates: {
        firstName?: string
        lastName?: string
        username?: string
      } = {}

      const trimmedFirst = firstName.trim()
      const trimmedLast = lastName.trim()
      const trimmedUsername = username.trim()

      if (trimmedFirst !== (user.firstName ?? '')) {
        updates.firstName = trimmedFirst || undefined
      }
      if (trimmedLast !== (user.lastName ?? '')) {
        updates.lastName = trimmedLast || undefined
      }
      if (trimmedUsername !== (user.username ?? '')) {
        updates.username = trimmedUsername || undefined
      }

      await updateProfile(updates)
      setMessage('Profile saved.')
    } catch (err) {
      if (isReverificationCancelledError(err)) return
      setError(getClerkErrorMessage(err))
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
          <h2 className='text-lg font-bold'>Profile</h2>
          <p className='text-sm text-muted-foreground'>
            Update your name, username, and photo
          </p>
        </div>

        <div className='flex items-center gap-4'>
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt=''
              className='h-20 w-20 shrink-0 rounded-full border-2 border-border object-cover'
            />
          ) : (
            <div
              aria-hidden
              className='flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-border bg-muted text-2xl font-black text-muted-foreground'
            >
              {(firstName || username || 'L').charAt(0).toUpperCase()}
            </div>
          )}

          <div className='space-y-2'>
            <input
              ref={fileInputRef}
              id={avatarInputId}
              type='file'
              accept='image/*'
              className='sr-only'
              disabled={uploadingAvatar}
              onChange={event => {
                const file = event.target.files?.[0]
                if (file) void handleAvatarChange(file)
                event.target.value = ''
              }}
            />
            <button
              type='button'
              disabled={uploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border-2 border-border px-4 py-2 text-sm font-bold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              <Edit02Icon
                size={16}
                strokeWidth={2}
                aria-hidden
              />
              {uploadingAvatar ? 'Uploading…' : 'Change photo'}
            </button>
            <p className='text-xs text-muted-foreground'>
              JPG, PNG, or GIF. Max 10 MB.
            </p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <label
              htmlFor={firstNameId}
              className='text-sm font-bold'
            >
              First name
            </label>
            <input
              id={firstNameId}
              type='text'
              autoComplete='given-name'
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              className={accountInputClassName}
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor={lastNameId}
              className='text-sm font-bold'
            >
              Last name
            </label>
            <input
              id={lastNameId}
              type='text'
              autoComplete='family-name'
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              className={accountInputClassName}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={usernameId}
            className='text-sm font-bold'
          >
            Username
          </label>
          <input
            id={usernameId}
            type='text'
            autoComplete='username'
            value={username}
            onChange={event => setUsername(event.target.value)}
            className={accountInputClassName}
          />
        </div>

        <div className='space-y-2'>
          <label
            htmlFor={emailId}
            className='text-sm font-bold'
          >
            Email
          </label>
          <input
            id={emailId}
            type='email'
            readOnly
            value={email}
            className={cn(accountInputClassName, 'bg-muted text-muted-foreground')}
            aria-describedby={`${emailId}-status`}
          />
          <p
            id={`${emailId}-status`}
            className={cn(
              'text-xs',
              emailVerified ? 'text-muted-foreground' : 'text-primary',
            )}
          >
            {emailVerified
              ? 'Email verified.'
              : 'Email not verified. Check your inbox or manage email in Clerk account menu.'}
          </p>
        </div>

        {error ? (
          <p
            role='alert'
            className='text-sm font-medium text-destructive'
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            role='status'
            className='text-sm font-medium text-primary'
          >
            {message}
          </p>
        ) : null}

        <button
          type='submit'
          disabled={!isDirty || saving}
          className={accountPrimaryButtonClassName}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Card>
  )
}

export function ProfileForm() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <Card aria-busy='true'>
        <p className='text-sm text-muted-foreground'>Loading profile…</p>
      </Card>
    )
  }

  if (!user) return null

  return <ProfileFormFields key={user.id} user={user} />
}
