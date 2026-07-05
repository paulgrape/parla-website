'use client'

import { AccountDangerZone } from '@/components/account/AccountDangerZone'
import { PasswordForm } from '@/components/account/PasswordForm'
import { ProfileForm } from '@/components/account/ProfileForm'
import { Card } from '@/components/ui/card'

export function ProfileTab() {
  return (
    <div className='space-y-6'>
      <ProfileForm />
      <PasswordForm />
      <Card className='space-y-5'>
        <div>
          <h2 className='text-lg font-bold'>Account actions</h2>
          <p className='text-sm text-muted-foreground'>
            Sign out or permanently delete your account
          </p>
        </div>
        <AccountDangerZone />
      </Card>
    </div>
  )
}
