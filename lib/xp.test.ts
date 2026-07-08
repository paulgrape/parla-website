import {describe, expect, it} from 'vitest'

import {didLevelUp, xpInCurrentLevel, xpToLevel} from './xp'

describe('xp', () => {
  it('maps xp to level', () => {
    expect(xpToLevel(0)).toBe(1)
    expect(xpToLevel(99)).toBe(1)
    expect(xpToLevel(100)).toBe(2)
    expect(xpToLevel(250)).toBe(3)
  })

  it('tracks xp within current level', () => {
    expect(xpInCurrentLevel(0)).toBe(0)
    expect(xpInCurrentLevel(99)).toBe(99)
    expect(xpInCurrentLevel(100)).toBe(0)
  })

  it('detects level up crossings', () => {
    expect(didLevelUp(99, 100)).toBe(true)
    expect(didLevelUp(100, 150)).toBe(false)
    expect(didLevelUp(199, 200)).toBe(true)
  })
})
