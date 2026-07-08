/**
 * iOS PWA startup images for iPhone 11 / XR.
 *
 * Light entries use the `screen and …` prefix. Dark entries must NOT include
 * `screen and` before `prefers-color-scheme` — see pwa-asset-generator #51.
 */
export const IOS_SPLASH_SCREENS = [
  {
    href: '/splash/iphone11-portrait-light.jpg',
    media:
      'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    href: '/splash/iphone11-portrait-dark.jpg',
    media:
      '(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    href: '/splash/iphone11-landscape-light.jpg',
    media:
      'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
  },
  {
    href: '/splash/iphone11-landscape-dark.jpg',
    media:
      '(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
  },
  {
    href: '/splash/iphone11-zoomed-light.jpg',
    media:
      'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  },
  {
    href: '/splash/iphone11-zoomed-dark.jpg',
    media:
      '(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
  }
] as const
