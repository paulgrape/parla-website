'use client'

import { preloadSounds } from '@/lib/sound'
import { useEffect } from 'react'

export function SoundPreloader() {
  useEffect(() => {
    void preloadSounds()
  }, [])

  return null
}
