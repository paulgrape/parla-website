import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LessonEngine } from "@/components/lesson/LessonEngine";
import { fetchApiServer } from "@/lib/api";
import type { Exercise } from "@llp/types";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  if (!token) redirect("/sign-in");

  let exercises: Exercise[] = [];

  try {
    exercises = await fetchApiServer<Exercise[]>(`/lessons/${lessonId}/exercises`, token);
  } catch {
    redirect("/dashboard");
  }

  return (
    <div>
      <LessonEngine lessonId={lessonId} exercises={exercises} />
    </div>
  );
}
