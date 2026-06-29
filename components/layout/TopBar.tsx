"use client";

import { ThemedUserButton } from "@/components/auth/ThemedUserButton";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FireIcon } from "hugeicons-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useApi } from "@/lib/api";
import type { UserStats } from "@llp/types";

interface TopBarProps {
  streak?: number;
}

export function TopBar({ streak: initialStreak = 0 }: TopBarProps) {
  const pathname = usePathname();
  const { fetchApi } = useApi();
  const [streak, setStreak] = useState(initialStreak);

  useEffect(() => {
    fetchApi<UserStats>("/me")
      .then((stats) => setStreak(stats.streak))
      .catch(() => {
        // Keep initial value if API is unavailable
      });
  }, [fetchApi]);

  // Desktop has no top navbar; immersive lesson flow hides it on mobile too.
  if (pathname.startsWith("/lesson/")) return null;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-border bg-card px-4 py-3 md:hidden">
      <span className="text-lg font-black text-primary font-display">Parla</span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <FireIcon size={20} strokeWidth={2} className="text-orange-500" />
          <span className="font-bold text-orange-500">{streak}</span>
        </div>
        <ThemeToggle />
        <ThemedUserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
