"use client";

import Link from "next/link";
import { Check, Lock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lesson, Unit } from "@llp/types";

interface UnitMapProps {
  units: (Unit & { lessons: Lesson[] })[];
  completedLessons: string[];
}

export function UnitMap({ units, completedLessons }: UnitMapProps) {
  const allLessons = units.flatMap((u) =>
    u.lessons.map((l) => ({ ...l, unitOrder: u.order }))
  );

  const isUnlocked = (lesson: Lesson & { unitOrder: number }, index: number) => {
    if (index === 0) return true;
    const prev = allLessons[index - 1];
    return completedLessons.includes(prev.id);
  };

  return (
    <div className="space-y-12">
      {units.map((unit) => (
        <section key={unit.id}>
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-wide text-primary">
              Chapter {unit.order}
            </p>
            <h2 className="text-xl font-black md:text-2xl">{unit.title}</h2>
            {unit.description && (
              <p className="text-muted-foreground">{unit.description}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            {unit.lessons.map((lesson, lessonIndex) => {
              const globalIndex = allLessons.findIndex((l) => l.id === lesson.id);
              const completed = completedLessons.includes(lesson.id);
              const unlocked = isUnlocked(
                { ...lesson, unitOrder: unit.order },
                globalIndex
              );

              return (
                <div key={lesson.id} className="flex flex-col items-center">
                  {lessonIndex > 0 && (
                    <div
                      className={cn(
                        "h-8 w-1 rounded-full mb-2",
                        completed || unlocked ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                  <Link
                    href={unlocked ? `/lesson/${lesson.id}` : "#"}
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-full border-4 font-bold transition-transform md:h-16 md:w-16",
                      completed
                        ? "border-primary bg-primary text-white shadow-[0_4px_0_0_#46a302]"
                        : unlocked
                          ? "border-primary bg-white text-primary shadow-[0_4px_0_0_#46a302] hover:scale-105"
                          : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={(e) => !unlocked && e.preventDefault()}
                  >
                    {completed ? (
                      <Check className="h-7 w-7" />
                    ) : unlocked ? (
                      <Star className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </Link>
                  <p
                    className={cn(
                      "mt-2 text-sm font-bold text-center max-w-30",
                      !unlocked && "text-muted-foreground"
                    )}
                  >
                    Level {lesson.order}: {lesson.title}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
