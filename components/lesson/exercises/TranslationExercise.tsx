"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TranslationExerciseProps {
  prompt: string;
  options: string[];
  selected: string | null;
  revealed: boolean;
  correctAnswer: string;
  onSelect: (option: string) => void;
  onContinue: () => void;
}

export function TranslationExercise({
  prompt,
  options,
  selected,
  revealed,
  correctAnswer,
  onSelect,
  onContinue,
}: TranslationExerciseProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase text-muted-foreground mb-2">
          Translate this word
        </p>
        <h2 className="text-3xl font-black">{prompt}</h2>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === correctAnswer;

          return (
            <button
              key={option}
              disabled={revealed}
              onClick={() => onSelect(option)}
              className={cn(
                "rounded-2xl border-2 border-border px-6 py-4 text-left font-bold transition-all",
                !revealed && "hover:border-primary hover:bg-primary/5",
                revealed && isCorrect && "border-primary bg-primary/10 text-primary",
                revealed && isSelected && !isCorrect && "border-destructive bg-destructive/10 text-destructive animate-shake"
              )}
            >
              <span className="flex items-center justify-between">
                {option}
                {revealed && isCorrect && <Check className="h-5 w-5" />}
                {revealed && isSelected && !isCorrect && <X className="h-5 w-5" />}
              </span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <Button onClick={onContinue} className="w-full" size="lg">
          Continue
        </Button>
      )}
    </div>
  );
}

export function XpPop({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 text-2xl font-black text-primary"
        >
          +10 XP
        </motion.span>
      )}
    </AnimatePresence>
  );
}
