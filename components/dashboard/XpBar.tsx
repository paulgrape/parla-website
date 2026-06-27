"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface XpBarProps {
  xp: number;
  level?: number;
}

export function XpBar({ xp, level = Math.floor(xp / 100) + 1 }: XpBarProps) {
  const xpInLevel = xp % 100;

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold uppercase text-muted-foreground">XP Level {level}</p>
        <p className="text-sm font-bold text-primary">{xp} XP</p>
      </div>
      <Progress value={xpInLevel} />
      <p className="mt-2 text-xs text-muted-foreground">
        {100 - xpInLevel} XP to reach level {level + 1}
      </p>
    </Card>
  );
}
