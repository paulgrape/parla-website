export const XP_PER_LEVEL = 100

export function xpToLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpInCurrentLevel(xp: number) {
  return xp % XP_PER_LEVEL
}

export function didLevelUp(previousXp: number, newXp: number) {
  return xpToLevel(newXp) > xpToLevel(previousXp)
}
