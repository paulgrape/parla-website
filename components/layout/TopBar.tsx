"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { useApi } from "@/lib/api";
import type { UserStats } from "@llp/types";

interface TopBarProps {
  streak?: number;
  title?: string;
}

export function TopBar({ streak: initialStreak = 0, title }: TopBarProps) {
  const { fetchApi } = useApi();
  const [streak, setStreak] = useState(initialStreak);

  useEffect(() => {
    fetchApi<UserStats>("/me")
      .then((stats) => setStreak(stats.streak))
      .catch(() => {
        // Keep initial value if API is unavailable
      });
  }, [fetchApi]);
  return (
    <header className="flex items-center justify-between border-b-2 border-border bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg font-black text-primary md:hidden">Parla</span>
        {title && <h2 className="hidden md:block text-lg font-bold">{title}</h2>}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 md:hidden">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-bold text-orange-500">{streak}</span>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
