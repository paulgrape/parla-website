import {APP_DEFAULT_TITLE, APP_DESCRIPTION, APP_NAME} from '@/lib/constants'
import type {MetadataRoute} from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: APP_DEFAULT_TITLE,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#58cc02',
    background_color: '#f5f5f5',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
