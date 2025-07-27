"use client";

import type { Question } from "@/lib/questions";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: Question;
  onAnswerSelect: (questionId: string, value: number) => void;
  selectedAnswerValue?: number;
}

export function QuizQuestion({ question, onAnswerSelect, selectedAnswerValue }: QuizQuestionProps) {
  if (!question) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-2">
        {question.title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground mb-8">
        {question.subtitle}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(question.id, option.value)}
            className={cn(
              "p-5 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4",
              "hover:border-primary hover:bg-primary/5 hover:-translate-y-1",
              selectedAnswerValue === option.value
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-secondary border-transparent"
            )}
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="font-medium text-base">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
