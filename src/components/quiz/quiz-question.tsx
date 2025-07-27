"use client";

import type { Question, Answer } from "@/lib/questions";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface QuizQuestionProps {
  question: Question;
  onAnswerSelect: (questionId: string, answer: Answer) => void;
  onTextAnswer: (questionId: string, text: string) => void;
  selectedAnswer?: Answer;
}

export function QuizQuestion({ question, onAnswerSelect, onTextAnswer, selectedAnswer }: QuizQuestionProps) {
  if (!question) return null;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-headline font-semibold text-foreground mb-2">
        {question.conversationalTitle || question.title}
      </h2>
      
      {question.type === 'multiple-choice' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {question.options?.map((option) => (
            <button
              key={option.text}
              onClick={() => onAnswerSelect(question.id, option)}
              className={cn(
                "p-5 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4",
                "hover:border-primary hover:bg-primary/5 hover:-translate-y-1",
                selectedAnswer?.value === option.value
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-secondary border-transparent"
              )}
            >
              {option.emoji && <span className="text-2xl">{option.emoji}</span>}
              <span className="font-medium text-base">{option.text}</span>
            </button>
          ))}
        </div>
      )}

      {question.type === 'text' && (
         <div className="mt-8">
            <Input
              placeholder="Sua resposta..."
              onChange={(e) => onTextAnswer(question.id, e.target.value)}
              className="h-12 text-base"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Exemplos: "40h/mês da equipe", "Perdemos 15 leads bons por mês", "R$ 10k/mês em retrabalho", "Não consigo medir"
            </p>
         </div>
      )}
    </div>
  );
}
