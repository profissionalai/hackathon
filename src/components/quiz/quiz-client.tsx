"use client";

import { useState, useMemo } from "react";
import type { GenerateOpportunitiesOutput } from "@/ai/flows/generate-opportunities";
import { generateOpportunities } from "@/ai/flows/generate-opportunities";
import { questions, type Question } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { QuizHeader } from "./quiz-header";
import { QuizProgress } from "./quiz-progress";
import { QuizQuestion } from "./quiz-question";
import { QuizResults } from "./quiz-results";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type Answers = Record<string, number>;

export default function QuizClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GenerateOpportunitiesOutput | null>(null);
  const { toast } = useToast();

  const currentQuestion: Question = questions[currentStep];
  const selectedAnswerValue = answers[currentQuestion?.id];

  const handleAnswerSelect = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const score = useMemo(() => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  }, [answers]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const plainAnswers = questions.reduce((acc, q) => {
        const answerValue = answers[q.id];
        const selectedOption = q.options.find(opt => opt.value === answerValue);
        acc[q.title] = selectedOption ? selectedOption.text : 'Não respondido';
        return acc;
      }, {} as Record<string, string>);

      const genAIResults = await generateOpportunities({
        questionnaireResponses: plainAnswers,
        aiReadinessScore: score,
      });
      setResults(genAIResults);
      setIsComplete(true);
    } catch (error) {
      console.error("Error generating opportunities:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar as oportunidades. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="rounded-2xl shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20">
        <QuizHeader />
        <CardContent className="p-6 md:p-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
              <h2 className="text-2xl font-headline font-semibold text-primary-foreground">Analisando suas respostas...</h2>
              <p className="text-muted-foreground mt-2">Estamos gerando suas oportunidades de IA personalizadas!</p>
            </div>
          ) : isComplete && results ? (
            <QuizResults score={score} opportunities={results.opportunities} />
          ) : (
            <>
              <QuizProgress value={progressPercentage} />
              <QuizQuestion
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswerValue={selectedAnswerValue}
              />
              <div className="mt-8">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswerValue === undefined}
                  className="w-full text-lg py-6 font-bold font-headline"
                  size="lg"
                >
                  {currentStep < questions.length - 1 ? "Próximo" : "Ver meu Diagnóstico"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
