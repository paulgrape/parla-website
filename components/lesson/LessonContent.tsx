"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api";
import { LessonEngine } from "@/components/lesson/LessonEngine";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@llp/types";

interface LessonContentProps {
  lessonId: string;
}

export function LessonContent({ lessonId }: LessonContentProps) {
  const router = useRouter();
  const { fetchApi } = useApi();
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<Exercise[]>(`/lessons/${lessonId}/exercises`)
      .then(setExercises)
      .catch(() => {
        setError("Could not load this level. Make sure the API is running (npm run dev:api).");
      });
  }, [fetchApi, lessonId]);

  if (error) {
    return (
      <div className="mx-auto max-w-md py-20 text-center space-y-4">
        <p className="font-bold text-destructive">{error}</p>
        <Button onClick={() => router.push("/dashboard")}>Back to map</Button>
      </div>
    );
  }

  if (!exercises) {
    return <p className="text-center text-muted-foreground py-20">Loading level...</p>;
  }

  if (exercises.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center space-y-4">
        <p className="font-bold">This level has no exercises yet.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to map</Button>
      </div>
    );
  }

  return <LessonEngine lessonId={lessonId} exercises={exercises} />;
}
