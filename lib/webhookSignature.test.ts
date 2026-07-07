import {Webhook} from 'svix'
import {describe, expect, it} from 'vitest'

const SECRET = `whsec_${Buffer.from('supersecretsigningkey_123456').toString('base64')}`

function signedHeaders(id: string, timestamp: Date, payload: string) {
  const wh = new Webhook(SECRET)
  const signature = wh.sign(id, timestamp, payload)
  return {
    'svix-id': id,
    'svix-timestamp': Math.floor(timestamp.getTime() / 1000).toString(),
    'svix-signature': signature
  }
}

describe('clerk webhook signature verification', () => {
  const payload = JSON.stringify({
    type: 'user.updated',
    data: {id: 'user_1'}
  })
  const id = 'msg_test'
  const timestamp = new Date()

  it('verifies a correctly signed payload', () => {
    const wh = new Webhook(SECRET)
    const headers = signedHeaders(id, timestamp, payload)
    expect(() => wh.verify(payload, headers)).not.toThrow()
  })

  it('throws on a tampered payload', () => {
    const wh = new Webhook(SECRET)
    const headers = signedHeaders(id, timestamp, payload)
    const tampered = JSON.stringify({
      type: 'user.updated',
      data: {id: 'attacker'}
    })
    expect(() => wh.verify(tampered, headers)).toThrow()
  })

  it('throws on a wrong signing secret', () => {
    const other = new Webhook(`whsec_${Buffer.from('a-different-secret-value-000000').toString('base64')}`)
    const headers = signedHeaders(id, timestamp, payload)
    expect(() => other.verify(payload, headers)).toThrow()
  })
})
