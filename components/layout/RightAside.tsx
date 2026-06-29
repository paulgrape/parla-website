"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FireIcon, StarIcon, FavouriteIcon } from "hugeicons-react";
import { useApi } from "@/lib/api";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { XpBar } from "@/components/dashboard/XpBar";
import type { UserStats } from "@llp/types";

const FULL_HEARTS = 5;

export function RightAside() {
  const pathname = usePathname();
  const { fetchApi } = useApi();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchApi<UserStats>("/me")
      .then(setStats)
      .catch(() => {
        // Keep aside empty if API is unavailable
      });
  }, [fetchApi]);

  // Immersive lesson flow: hide the aside while inside a lesson.
  if (pathname.startsWith("/lesson/")) return null;

  const streak = stats?.streak ?? 0;
  const xp = stats?.xp ?? 0;
  const nextReview = stats?.nextReview ?? 0;

  return (
    <aside className="sticky top-0 hidden h-screen w-92 shrink-0 flex-col gap-5 overflow-y-auto border-l-2 border-border bg-card p-6 lg:flex">
      <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-border px-4 py-3">
        <div className="flex items-center gap-1.5 font-black text-orange-500">
          <FireIcon size={22} strokeWidth={2.5} />
          {streak}
        </div>
        <div className="flex items-center gap-1.5 font-black text-primary">
          <StarIcon size={22} strokeWidth={2.5} />
          {xp}
        </div>
        <div className="flex items-center gap-1.5 font-black text-destructive">
          <FavouriteIcon size={22} strokeWidth={2.5} />
          {FULL_HEARTS}
        </div>
      </div>

      <StreakCard streak={streak} longestStreak={streak} />
      <XpBar xp={xp} />

      {nextReview > 0 && (
        <Link
          href="/review"
          className="rounded-3xl border-2 border-primary bg-primary/5 p-4 transition-colors hover:bg-primary/10"
        >
          <p className="font-bold text-primary">
            {nextReview} word{nextReview !== 1 ? "s" : ""} ready for review
          </p>
          <p className="text-sm text-muted-foreground">Tap to start a review session</p>
        </Link>
      )}
    </aside>
  );
}
