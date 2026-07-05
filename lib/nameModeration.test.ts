import { describe, expect, it } from 'vitest'
import { checkName, checkProfileNames, getNameViolations } from './nameModeration'

describe('checkName', () => {
  it('accepts normal names and unicode letters', () => {
    expect(checkName('Marco').ok).toBe(true)
    expect(checkName('Renée').ok).toBe(true)
    expect(checkName("O'Brien-Rossi").ok).toBe(true)
    expect(checkName('李').ok).toBe(true)
  })

  it('treats null / empty / whitespace as allowed (optional field)', () => {
    expect(checkName(null).ok).toBe(true)
    expect(checkName(undefined).ok).toBe(true)
    expect(checkName('').ok).toBe(true)
    expect(checkName('   ').ok).toBe(true)
  })

  it('rejects over-length names', () => {
    const result = checkName('a'.repeat(31))
    expect(result.ok).toBe(false)
  })

  it('rejects invalid characters', () => {
    expect(checkName('bad<name>').ok).toBe(false)
    expect(checkName('a_b').ok).toBe(false)
    expect(checkName('name123').ok).toBe(false)
  })

  it('rejects profanity via obscenity matcher', () => {
    expect(checkName('fuck').ok).toBe(false)
    expect(checkName('shit').ok).toBe(false)
    expect(checkName('wordsbeforefuckandafter').ok).toBe(false)
  })

  it('rejects reserved staff handles', () => {
    expect(checkName('admin').ok).toBe(false)
    expect(checkName('moderator').ok).toBe(false)
  })

  it('rejects digit/symbol inputs before profanity check runs', () => {
    expect(checkName('sh1t').ok).toBe(false)
    expect(checkName('n1gger').ok).toBe(false)
    expect(checkName('$hit').ok).toBe(false)
  })

  it('includes the field label in the reason', () => {
    const result = checkName('fuck', 'Username')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.reason).toContain('Username')
  })
})

describe('checkProfileNames', () => {
  it('passes when all fields are clean', () => {
    expect(
      checkProfileNames({ firstName: 'Anna', lastName: 'Bianchi', username: 'annab' }).ok,
    ).toBe(true)
  })

  it('fails on the first offending field', () => {
    const result = checkProfileNames({ firstName: 'Anna', username: 'admin' })
    expect(result.ok).toBe(false)
  })
})

describe('getNameViolations', () => {
  it('returns no violations for clean data', () => {
    const result = getNameViolations({
      id: 'user_123',
      first_name: 'Anna',
      last_name: 'Bianchi',
      username: 'annab',
    })
    expect(result.violations).toHaveLength(0)
    expect(result.revert).toEqual({})
  })

  it('blanks offending first/last names and replaces username with neutral handle', () => {
    const result = getNameViolations({
      id: 'user_ABC1234567890',
      first_name: 'fuck',
      last_name: 'shit',
      username: 'admin',
    })
    expect(result.violations).toHaveLength(3)
    expect(result.revert.firstName).toBe('')
    expect(result.revert.lastName).toBe('')
    expect(result.revert.username).toMatch(/^user[a-zA-Z0-9]+$/)
    expect(result.revert.username).not.toContain('admin')
  })
})
