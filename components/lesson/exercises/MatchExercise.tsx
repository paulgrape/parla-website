"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchExerciseProps {
  answer: string;
  onMistake: () => void;
  onComplete: () => void;
}

interface Pair {
  italian: string;
  english: string;
}

function parsePairs(answer: string): Pair[] {
  const parsed = JSON.parse(answer) as unknown;
  if (!Array.isArray(parsed)) return [];

  return parsed.map((item) => {
    if (Array.isArray(item) && item.length >= 2) {
      return { italian: String(item[0]), english: String(item[1]) };
    }
    if (item && typeof item === "object" && "italian" in item && "english" in item) {
      const pair = item as { italian: string; english: string };
      return { italian: pair.italian, english: pair.english };
    }
    return { italian: "", english: "" };
  }).filter((p) => p.italian && p.english);
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function MatchExercise({ answer, onMistake, onComplete }: MatchExerciseProps) {
  const pairs: Pair[] = useMemo(() => parsePairs(answer), [answer]);
  const [selectedItalian, setSelectedItalian] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [italianWords] = useState<string[]>(() => shuffle(pairs.map((p) => p.italian)));
  const [englishWords] = useState<string[]>(() => shuffle(pairs.map((p) => p.english)));

  const handleSelectItalian = (word: string) => {
    if (matched.has(word)) return;
    setSelectedItalian(word);
    setWrongPair(null);
  };

  const handleSelectEnglish = (word: string) => {
    if (!selectedItalian) return;

    const pair = pairs.find((p) => p.italian === selectedItalian);
    if (pair?.english === word) {
      const newMatched = new Set(matched);
      newMatched.add(selectedItalian);
      setMatched(newMatched);
      setSelectedItalian(null);

      if (newMatched.size === pairs.length) {
        onComplete();
      }
    } else {
      onMistake();
      setWrongPair(selectedItalian);
      setSelectedItalian(null);
      setTimeout(() => setWrongPair(null), 500);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase text-muted-foreground mb-2">
          Match the pairs
        </p>
        <h2 className="text-xl font-black">Tap one from each column</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {italianWords.map((word) => (
            <button
              key={word}
              disabled={matched.has(word)}
              onClick={() => handleSelectItalian(word)}
              className={cn(
                "rounded-2xl border-2 px-4 py-3 font-bold transition-all",
                matched.has(word) && "border-primary bg-primary/10 text-primary opacity-60",
                selectedItalian === word && "border-primary bg-primary/10",
                wrongPair === word && "border-destructive animate-shake",
                !matched.has(word) && selectedItalian !== word && "border-border hover:border-primary"
              )}
            >
              <span className="flex items-center justify-between">
                {word}
                {matched.has(word) && <Check className="h-4 w-4" />}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {englishWords.map((word) => (
            <button
              key={word}
              onClick={() => handleSelectEnglish(word)}
              className="rounded-2xl border-2 border-border px-4 py-3 font-bold hover:border-primary transition-all"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
