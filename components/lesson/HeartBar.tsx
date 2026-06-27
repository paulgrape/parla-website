"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeartBarProps {
  lives: number;
  maxLives?: number;
}

export function HeartBar({ lives, maxLives = 5 }: HeartBarProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, i) => (
        <Heart
          key={i}
          className={cn(
            "h-6 w-6 transition-colors",
            i < lives ? "fill-destructive text-destructive" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}
