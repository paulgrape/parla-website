import {notFound} from 'next/navigation'

import {MotionPlayground} from './MotionPlayground'

export default function DevMotionPage() {
  const allowDevPages = process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_PAGES === '1'

  if (!allowDevPages) {
    notFound()
  }

  return <MotionPlayground />
}
