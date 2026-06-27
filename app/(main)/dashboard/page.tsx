import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { XpBar } from "@/components/dashboard/XpBar";
import { UnitMap } from "@/components/dashboard/UnitMap";
import { fetchApiServer } from "@/lib/api";
import type { Lesson, Unit, UserStats } from "@llp/types";

export default async function DashboardPage() {
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  let stats: UserStats = { xp: 0, streak: 0, completedLessons: [], nextReview: 0 };
  let units: Unit[] = [];
  const unitsWithLessons: (Unit & { lessons: Lesson[] })[] = [];

  try {
    [stats, units] = await Promise.all([
      fetchApiServer<UserStats>("/me", token),
      fetchApiServer<Unit[]>("/units", token),
    ]);

    for (const unit of units) {
      const lessons = await fetchApiServer<Lesson[]>(`/units/${unit.id}/lessons`, token);
      unitsWithLessons.push({ ...unit, lessons });
    }
  } catch {
    // Graceful fallback when API is down
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black">Your learning path</h1>
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

      <UnitMap units={unitsWithLessons} completedLessons={stats.completedLessons} />
    </div>
  );
}
