'use client'

import { useApi } from '@/lib/api'
import type { HeartsState, UserStats } from '@llp/types'
import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface UserStatsContextValue {
  stats: UserStats | null
  loading: boolean
  refresh: () => Promise<void>
  loseHeart: () => Promise<void>
}

const UserStatsContext = createContext<UserStatsContextValue | null>(null)

export function UserStatsProvider({ children }: { children: React.ReactNode }) {
  const { fetchApi } = useApi()
  const pathname = usePathname()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const next = await fetchApi<UserStats>('/me')
      setStats(next)
    } catch {
      // Keep the last known stats if the API is unavailable.
    } finally {
      setLoading(false)
    }
  }, [fetchApi])

  // Refetch on mount and whenever the route changes (e.g. returning to the
  // dashboard after finishing a level updates XP / streak / hearts).
  useEffect(() => {
    void refresh()
  }, [refresh, pathname])

  const loseHeart = useCallback(async () => {
    try {
      const result = await fetchApi<HeartsState>('/hearts/lose', {
        method: 'POST',
      })
      setStats(prev => (prev ? { ...prev, ...result } : prev))
    } catch {
      // Optimistically degrade: drop a heart locally so the UI stays in sync.
      setStats(prev =>
        prev ? { ...prev, hearts: Math.max(0, prev.hearts - 1) } : prev,
      )
    }
  }, [fetchApi])

  // When the regen timer elapses, pull the authoritative value once.
  const refreshRef = useRef(refresh)
  refreshRef.current = refresh
  const nextHeartAt = stats?.nextHeartAt ?? null

  useEffect(() => {
    if (!nextHeartAt) return

    const tick = () => {
      if (Date.now() >= nextHeartAt) {
        void refreshRef.current()
      }
    }

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [nextHeartAt])

  return (
    <UserStatsContext.Provider value={{ stats, loading, refresh, loseHeart }}>
      {children}
    </UserStatsContext.Provider>
  )
}

export function useUserStats() {
  const context = useContext(UserStatsContext)
  if (!context) {
    throw new Error('useUserStats must be used within a UserStatsProvider')
  }
  return context
}
