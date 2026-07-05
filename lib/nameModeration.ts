import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'

const MAX_NAME_LENGTH = 30
const MIN_NAME_LENGTH = 1

const ALLOWED_NAME_PATTERN = /^[\p{L}\p{M} '.-]+$/u

const RESERVED_HANDLE_SUBSTRINGS = ['admin', 'moderator', 'support'] as const

const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

export type NameCheckResult = { ok: true } | { ok: false; reason: string }

function containsReservedHandle(value: string): boolean {
  const normalized = value.toLowerCase().replace(/[^a-z]/g, '')
  return RESERVED_HANDLE_SUBSTRINGS.some(handle => normalized.includes(handle))
}

export function checkName(
  rawValue: string | null | undefined,
  fieldLabel = 'Name',
): NameCheckResult {
  if (rawValue == null) return { ok: true }

  const value = rawValue.trim().replace(/\s+/g, ' ')
  if (value.length === 0) return { ok: true }

  if (value.length < MIN_NAME_LENGTH) {
    return { ok: false, reason: `${fieldLabel} is too short.` }
  }
  if (value.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      reason: `${fieldLabel} must be ${MAX_NAME_LENGTH} characters or fewer.`,
    }
  }

  if (!ALLOWED_NAME_PATTERN.test(value)) {
    return {
      ok: false,
      reason: `${fieldLabel} contains invalid characters.`,
    }
  }

  if (profanityMatcher.hasMatch(value)) {
    return {
      ok: false,
      reason: `${fieldLabel} contains a word that is not allowed.`,
    }
  }

  if (containsReservedHandle(value)) {
    return {
      ok: false,
      reason: `${fieldLabel} contains a word that is not allowed.`,
    }
  }

  return { ok: true }
}

export function checkProfileNames(fields: {
  firstName?: string | null
  lastName?: string | null
  username?: string | null
}): NameCheckResult {
  const checks: [string | null | undefined, string][] = [
    [fields.firstName, 'First name'],
    [fields.lastName, 'Last name'],
    [fields.username, 'Username'],
  ]

  for (const [value, label] of checks) {
    const result = checkName(value, label)
    if (!result.ok) return result
  }

  return { ok: true }
}

export type NameViolationResult = {
  violations: string[]
  revert: { firstName?: string; lastName?: string; username?: string }
}

export function getNameViolations(data: {
  id: string
  first_name: string | null
  last_name: string | null
  username: string | null
}): NameViolationResult {
  const firstNameCheck = checkName(data.first_name, 'First name')
  const lastNameCheck = checkName(data.last_name, 'Last name')
  const usernameCheck = checkName(data.username, 'Username')

  const violations: string[] = []
  const revert: NameViolationResult['revert'] = {}

  if (!firstNameCheck.ok) {
    violations.push(firstNameCheck.reason)
    revert.firstName = ''
  }
  if (!lastNameCheck.ok) {
    violations.push(lastNameCheck.reason)
    revert.lastName = ''
  }
  if (!usernameCheck.ok) {
    violations.push(usernameCheck.reason)
    revert.username = `user${data.id.replace(/[^a-zA-Z0-9]/g, '').slice(-10)}`
  }

  return { violations, revert }
}
