import {notFound} from 'next/navigation'

import {PwaPlayground} from './PwaPlayground'

export default function DevPwaPage() {
  const allowDevPages = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_PAGES === '1'

  if (!allowDevPages) {
    notFound()
  }

  return <PwaPlayground />
}
