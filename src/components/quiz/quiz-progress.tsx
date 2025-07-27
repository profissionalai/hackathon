"use client";

import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  value: number;
  current: number;
  total: number;
}

export function QuizProgress({ value, current, total }: QuizProgressProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-muted-foreground">Pergunta {current} de {total}</p>
        <p className="text-sm font-medium text-muted-foreground">Menos de 2 minutos restantes</p>
      </div>
      <Progress value={value} className="h-2 w-full" />
    </div>
  );
}
