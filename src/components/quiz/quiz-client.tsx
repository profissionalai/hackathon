"use client";

import { useState, useMemo, useEffect } from "react";
import type { GenerateOpportunitiesOutput } from "@/ai/flows/generate-opportunities";
import { generateOpportunities } from "@/ai/flows/generate-opportunities";
import { allQuestions, type Question, type Answer, type Answers, getPainSubQuestion, isQuantifiablePain } from "@/lib/questions";
import { useToast } from "@/hooks/use-toast";
import { QuizHeader } from "./quiz-header";
import { QuizProgress } from "./quiz-progress";
import { QuizQuestion } from "./quiz-question";
import { QuizResults } from "./quiz-results";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Loader2, Mail, ArrowRight, CheckCircle, Phone, ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";

type QuizStep = "welcome" | "quiz" | "loading" | "results";

const PUBLIC_DOMAINS = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "aol.com"];

export default function QuizClient() {
  const [step, setStep] = useState<QuizStep>("welcome");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<GenerateOpportunitiesOutput | null>(null);
  const { toast } = useToast();

  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>(() => allQuestions.filter(q => q.id !== 'painSub' && q.id !== 'quantifyPain'));
  
  // This state will hold the total number of questions for the progress bar
  // and will only be updated on navigation.
  const [progressTotalQuestions, setProgressTotalQuestions] = useState(allQuestions.filter(q => q.id !== 'painSub' && q.id !== 'quantifyPain').length);


  useEffect(() => {
    const painAnswer = answers.pain?.text;
    if (!painAnswer) return;

    const newVisibleQuestions: Question[] = [];

    // Start with all non-conditional questions
    allQuestions.forEach(q => {
      if (q.id !== 'painSub' && q.id !== 'quantifyPain') {
        newVisibleQuestions.push(q);
      }
    });
    
    const painQuestionIndex = newVisibleQuestions.findIndex(q => q.id === 'pain');
    
    if (painQuestionIndex !== -1) {
        const questionsToAdd: Question[] = [];

        // Check and add pain sub-question
        const painSubQuestion = getPainSubQuestion(painAnswer);
        if (painSubQuestion) {
            questionsToAdd.push(painSubQuestion);
        }

        // Check and add quantify pain question
        if (isQuantifiablePain(painAnswer)) {
            const quantifyPainQuestion = allQuestions.find(q => q.id === 'quantifyPain');
            if (quantifyPainQuestion) {
                questionsToAdd.push(quantifyPainQuestion);
            }
        }

        // Insert new questions after the pain question
        if (questionsToAdd.length > 0) {
            newVisibleQuestions.splice(painQuestionIndex + 1, 0, ...questionsToAdd);
        }
    }
    
    setVisibleQuestions(newVisibleQuestions);

  }, [answers.pain]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const domain = newEmail.split('@')[1];

    if (newEmail.length > 5 && newEmail.includes('@')) {
      if (PUBLIC_DOMAINS.includes(domain)) {
        setEmailError("Use seu e-mail empresarial para recomendações mais precisas.");
        setIsEmailValid(false);
      } else {
        setEmailError(null);
        setIsEmailValid(true);
      }
    } else {
      setEmailError(null);
      setIsEmailValid(false);
    }
  };
  
  const startQuiz = () => {
    if (isEmailValid) {
      setProgressTotalQuestions(visibleQuestions.length);
      setStep("quiz");
    } else if (!emailError) {
       setEmailError("Por favor, insira um e-mail empresarial válido.");
    }
  };

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  const handleAnswerSelect = (questionId: string, answer: Answer) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [questionId]: answer };
      // If the pain question is being answered, we might need to reset subsequent conditional answers
      if (questionId === 'pain') {
          delete newAnswers.painSub;
          delete newAnswers.quantifyPain;
      }
      return newAnswers;
    });
  };
  
  const handleTextAnswer = (questionId: string, text: string) => {
    setAnswers((prev) => ({...prev, [questionId]: { text, value: 0, points: 0 } }));
  }
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setProgressTotalQuestions(visibleQuestions.length);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    // Check if the current question has an answer before proceeding
    const currentQuestionId = visibleQuestions[currentQuestionIndex]?.id;
    if (!currentQuestionId || answers[currentQuestionId] === undefined) {
      // Do not proceed if the current question is not answered
      // Special case for text inputs which might be empty but are considered "answered"
      if (currentQuestion.type === 'text' && answers[currentQuestionId]?.text !== '') {
         // allow empty text answer
      } else if (currentQuestion.type !== 'text') {
        return;
      }
    }
    
    // Update the total question count for the progress bar *before* navigating
    setProgressTotalQuestions(visibleQuestions.length);

    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const score = useMemo(() => {
    // Exclude quantifyPain from required answers check
    const requiredQuestions = visibleQuestions.filter(q => q.id !== 'quantifyPain');
    if (Object.keys(answers).length < requiredQuestions.length) {
      return 0;
    }

    const getPoints = (id: string, defaultValue = 0) => answers[id]?.points ?? defaultValue;
    
    const decisionLevel = getPoints('role');
    
    let painIntensity = 0;
    if (answers.quantifyPain?.points) { // If user quantified the pain
        painIntensity = answers.quantifyPain.points;
    } else if (answers.painSub) { // If user answered the sub-question (specific pain)
        painIntensity = 2;
    } else if (answers.pain?.text === "Não temos grandes gargalos no momento") {
        painIntensity = 0;
    } else if (answers.pain) { // Generic pain
        painIntensity = 1;
    }

    const investment = getPoints('investment');
    const urgency = getPoints('urgency');
    const maturity = getPoints('maturity');

    const finalScore = (decisionLevel * 0.15) + (painIntensity * 0.30) + (investment * 0.25) + (urgency * 0.15) + (maturity * 0.15);
    
    return Math.min(10, Math.max(0, finalScore * (10 / 3.3) )); // Normalize to 10
  }, [answers, visibleQuestions]);

  const handleSubmit = async () => {
    setStep("loading");
    try {
      const plainAnswers = Object.entries(answers).reduce((acc, [key, ans]) => {
        const question = allQuestions.find(q => q.id === key) || visibleQuestions.find(q => q.id === key);
        if (question) {
          acc[question.id] = ans.text;
        }
        return acc;
      }, {} as Record<string, string>);

      const genAIResults = await generateOpportunities({
        questionnaireResponses: { ...plainAnswers, phone },
        aiReadinessScore: score,
        userEmail: email,
        sector: answers.sector?.text || "Não informado",
        painPoint: answers.pain?.text || "Não informado",
      });
      setResults(genAIResults);
      setStep("results");
    } catch (error) {
      console.error("Error generating opportunities:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar as oportunidades. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setStep("quiz"); // Go back to quiz on error
    }
  };

  const progressPercentage = useMemo(() => {
    if (progressTotalQuestions === 0) return 0;
    // Use the stable total question count for progress calculation
    return (currentQuestionIndex / progressTotalQuestions) * 100;
  }, [currentQuestionIndex, progressTotalQuestions]);
  
  const renderContent = () => {
    switch(step) {
      case "welcome":
        return (
          <div className="text-center p-6 md:p-10 animate-fade-in">
            <h2 className="text-3xl font-headline font-bold text-primary mb-4">Seja bem-vindo(a) ao Diagnóstico IA Hunter!</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Para começar, precisamos validar seu e-mail empresarial. Isso nos ajuda a oferecer recomendações mais precisas e personalizadas para o seu negócio.</p>
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="tel"
                  placeholder="Seu telefone com DDD"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="seu@email-empresarial.com"
                  value={email}
                  onChange={handleEmailChange}
                  className="pl-10 h-12 text-base"
                />
              </div>
              {emailError && <p className="text-destructive text-sm mt-2">{emailError}</p>}
              {isEmailValid && !emailError && <p className="text-green-500 text-sm mt-2 flex items-center justify-center"><CheckCircle className="w-4 h-4 mr-1"/> Ótimo! Vamos começar.</p>}

              <Button
                onClick={startQuiz}
                disabled={!isEmailValid}
                className="w-full text-lg py-6 font-bold font-headline mt-6"
                size="lg"
              >
                Começar Diagnóstico <ArrowRight className="ml-2"/>
              </Button>
               <p className="text-xs text-muted-foreground mt-4">💡 Use seu e-mail corporativo para receber recomendações mais precisas!</p>
            </div>
          </div>
        );
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
            <h2 className="text-2xl font-headline font-semibold text-primary-foreground">Analisando seu perfil...</h2>
            <p className="text-muted-foreground mt-2">Estamos gerando suas oportunidades de IA personalizadas!</p>
          </div>
        );
      case "results":
        return results ? (
            <QuizResults score={score} results={results} />
          ) : null;
      case "quiz":
        return (
            <>
              <QuizProgress value={progressPercentage} />
              <QuizQuestion
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                onTextAnswer={handleTextAnswer}
                selectedAnswer={selectedAnswer}
              />
              <div className="mt-8 flex items-center gap-4">
                {currentQuestionIndex > 0 && (
                   <Button
                    onClick={handleBack}
                    variant="outline"
                    className="text-lg py-6 font-bold font-headline"
                  >
                    <ArrowLeft className="mr-2"/> Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === undefined && currentQuestion?.type !== 'text'}
                  className="w-full text-lg py-6 font-bold font-headline"
                  size="lg"
                >
                  {currentQuestionIndex < visibleQuestions.length - 1 ? "Próximo" : "Ver meu Diagnóstico"}
                   {currentQuestionIndex < visibleQuestions.length - 1 && <ArrowRight className="ml-2"/>}
                </Button>
              </div>
            </>
          );
    }
  }


  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card className="rounded-2xl shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20">
        <QuizHeader isQuizStarted={step !== 'welcome'} />
        <CardContent className="p-6 md:p-10">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
