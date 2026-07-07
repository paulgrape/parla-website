import type {Section} from '@llp/types'

export function isSectionComplete(section: Section): boolean {
  const lessonCount = section.lessonCount ?? 0
  const completedCount = section.completedCount ?? 0
  return lessonCount > 0 && completedCount >= lessonCount
}

export function isSectionUnlocked(sections: Section[], index: number): boolean {
  return sections.slice(0, index).every(isSectionComplete)
}

export function resolveActiveSection(allSections: Section[], sectionIdParam: string | null): Section | null {
  const defaultSection = allSections.find(s => !isSectionComplete(s)) ?? allSections[allSections.length - 1] ?? null

  if (!sectionIdParam) {
    return defaultSection
  }

  const requestedIndex = allSections.findIndex(s => s.id === sectionIdParam)
  if (requestedIndex < 0) {
    return defaultSection
  }

  if (!isSectionUnlocked(allSections, requestedIndex)) {
    return defaultSection
  }

  return allSections[requestedIndex] ?? defaultSection
}
