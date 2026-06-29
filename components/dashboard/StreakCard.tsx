"use client";

import { FireIcon } from "hugeicons-react";
import { Card } from "@/components/ui/card";

interface StreakCardProps {
  streak: number;
  longestStreak: number;
}

export function StreakCard({ streak, longestStreak }: StreakCardProps) {
  return (
    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">
          <FireIcon size={32} strokeWidth={2} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-orange-600">Current Streak</p>
          <p className="text-4xl font-black text-orange-500">{streak}</p>
          <p className="text-xs text-orange-600">Best: {longestStreak} days</p>
        </div>
      </div>
    </Card>
  );
}
