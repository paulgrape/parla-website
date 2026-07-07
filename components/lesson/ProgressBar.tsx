'use client'

import {Progress} from '@/components/ui/progress'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({current, total}: ProgressBarProps) {
  const percent = (current / total) * 100

  return (
    <div className='w-full'>
      <Progress
        value={percent}
        label={`Lesson progress, ${current} of ${total}`}
      />
    </div>
  )
}
