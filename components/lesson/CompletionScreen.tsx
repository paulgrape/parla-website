"use client";

import { motion } from "framer-motion";
import { Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionScreenProps {
  totalXp: number;
  streak: number;
  perfect: boolean;
  mistakes: number;
  onContinue: () => void;
}

export function CompletionScreen({
  totalXp,
  streak,
  perfect,
  mistakes,
  onContinue,
}: CompletionScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 p-6"
    >
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary"
        >
          <Star className="h-12 w-12 text-white fill-white" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-black text-primary">Level Complete!</h2>
          {perfect && (
            <p className="mt-2 text-sm font-bold text-orange-500">
              Perfect level! +20 bonus XP
            </p>
          )}
          {!perfect && mistakes > 0 && (
            <p className="mt-2 text-sm font-bold text-primary">
              Nice recovery. You fixed {mistakes} mistake{mistakes === 1 ? "" : "s"}.
            </p>
          )}
        </div>

        <div className="flex gap-6 md:gap-8">
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">XP Earned</p>
            <p className="text-3xl font-black text-primary md:text-4xl">{totalXp}</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase text-muted-foreground">Streak</p>
            <p className="flex items-center justify-center gap-1 text-3xl font-black text-orange-500 md:text-4xl">
              <Flame className="h-8 w-8" />
              {streak}
            </p>
          </div>
        </div>

        <Button onClick={onContinue} size="lg" className="w-full">
          Continue
        </Button>
      </div>
    </motion.div>
  );
}
