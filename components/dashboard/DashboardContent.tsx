"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/api";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { XpBar } from "@/components/dashboard/XpBar";
import { UnitMap } from "@/components/dashboard/UnitMap";
import type { Lesson, Unit, UserStats } from "@llp/types";

export function DashboardContent() {
  const { fetchApi } = useApi();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [units, setUnits] = useState<(Unit & { lessons: Lesson[] })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchApi<UserStats>("/me"),
      fetchApi<Unit[]>("/units"),
    ])
      .then(([userStats, allUnits]) => {
        setStats(userStats);
        setUnits(
          allUnits.map((unit) => ({
            ...unit,
            lessons: unit.lessons ?? [],
          }))
        );
      })
      .catch(() => {
        setError("Could not load your learning path. Make sure the API is running (npm run dev:api).");
      })
      .finally(() => setLoading(false));
  }, [fetchApi]);

  if (loading) {
    return <p className="text-center text-muted-foreground py-12">Loading your path...</p>;
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-bold text-destructive">{error ?? "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Your learning path</h1>
        <p className="text-muted-foreground">Complete lessons to unlock new ones</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StreakCard streak={stats.streak} longestStreak={stats.streak} />
        <XpBar xp={stats.xp} />
      </div>

      {stats.nextReview > 0 && (
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-4">
          <p className="font-bold text-primary">
            {stats.nextReview} word{stats.nextReview !== 1 ? "s" : ""} ready for review
          </p>
        </div>
      )}

      {units.length === 0 ? (
        <div className="rounded-2xl border-2 border-border bg-muted p-6 text-center">
          <p className="font-bold">No lessons found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run <code className="rounded bg-white px-1">npm run db:seed</code> to populate the curriculum.
          </p>
        </div>
      ) : (
        <UnitMap units={units} completedLessons={stats.completedLessons} />
      )}
    </div>
  );
}
