import { getNameViolations } from '@/lib/nameModeration'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

async function moderateUserNames(data: {
  id: string
  first_name: string | null
  last_name: string | null
  username: string | null
  public_metadata: Record<string, unknown>
}) {
  const { violations, revert } = getNameViolations(data)
  if (violations.length === 0) return

  const client = await clerkClient()
  await client.users.updateUser(data.id, {
    ...revert,
    publicMetadata: {
      ...data.public_metadata,
      nameFlagged: true,
      nameFlaggedAt: new Date().toISOString(),
    },
  })

  console.warn('Reverted disallowed profile name(s):', data.id, violations)
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    try {
      await moderateUserNames({
        id: evt.data.id,
        first_name: evt.data.first_name,
        last_name: evt.data.last_name,
        username: evt.data.username,
        public_metadata: evt.data.public_metadata ?? {},
      })
    } catch (err) {
      console.error('Name moderation failed:', err)
    }
  }

  return new Response('OK', { status: 200 })
}
