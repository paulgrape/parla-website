import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { fetchApiServer } from "@/lib/api";
import type { UserStats } from "@llp/types";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = await auth();
  const token = await getToken();

  let stats: UserStats = { xp: 0, streak: 0, completedLessons: [], nextReview: 0 };

  if (token) {
    try {
      stats = await fetchApiServer<UserStats>("/me", token);
    } catch {
      // API may be unavailable during local dev
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar streak={stats.streak} xp={stats.xp} />
      <div className="flex flex-1 flex-col">
        <TopBar streak={stats.streak} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
