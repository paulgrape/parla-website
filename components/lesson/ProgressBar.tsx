'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className='w-full'>
      <Progress value={(current / total) * 100} />
    </div>
  )
}
