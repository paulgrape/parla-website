"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speakItalian } from "@/lib/speech";
import { isAnswerCorrect } from "@/lib/utils";

interface ListeningExerciseProps {
  audioText: string;
  answer: string;
  revealed: boolean;
  onSubmit: (correct: boolean) => void;
  onContinue: () => void;
}

export function ListeningExercise({
  audioText,
  answer,
  revealed,
  onSubmit,
  onContinue,
}: ListeningExerciseProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    onSubmit(isAnswerCorrect(input, answer));
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-bold uppercase text-muted-foreground mb-2">
          Listening exercise
        </p>
        <h2 className="text-xl font-black">Type what you hear</h2>
      </div>

      <button
        onClick={() => speakItalian(audioText)}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white shadow-[0_6px_0_0_#46a302] transition-transform hover:scale-105 active:shadow-none active:translate-y-1"
      >
        <Volume2 className="h-10 w-10" />
      </button>

      <input
        type="text"
        value={input}
        disabled={revealed}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !revealed && handleSubmit()}
        placeholder="Type what you heard..."
        className="w-full rounded-2xl border-2 border-border px-6 py-4 text-lg font-bold focus:border-primary focus:outline-none disabled:opacity-60"
      />

      {revealed ? (
        <div className="space-y-4">
          <p className="text-center font-bold">
            Correct answer: <span className="text-primary">{answer}</span>
          </p>
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue
          </Button>
        </div>
      ) : (
        <Button onClick={handleSubmit} disabled={!input.trim()} className="w-full" size="lg">
          Check
        </Button>
      )}
    </div>
  );
}
