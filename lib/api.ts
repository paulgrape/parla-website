'use client'

import { useAuth } from '@clerk/nextjs'
import { useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787'

export function useApi() {
  const { getToken } = useAuth()

  const fetchApi = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getToken()
      const timeZone =
        typeof Intl !== 'undefined'
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined

      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(timeZone ? { 'X-Time-Zone': timeZone } : {}),
          ...options.headers,
        },
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      return res.json() as Promise<T>
    },
    [getToken],
  )

  return { fetchApi }
}

export async function fetchApiServer<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json() as Promise<T>
}
