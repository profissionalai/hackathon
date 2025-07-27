"use client";

import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  value: number;
}

export function QuizProgress({ value }: QuizProgressProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <Progress value={value} className="h-2 w-full" />
    </div>
  );
}
