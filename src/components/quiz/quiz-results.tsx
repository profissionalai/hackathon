"use client";

import { useMemo } from "react";
import type { GenerateOpportunitiesOutput } from "@/ai/flows/generate-opportunities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, BarChart, Calendar, Target, CheckCircle } from "lucide-react";

interface QuizResultsProps {
  score: number;
  results: GenerateOpportunitiesOutput;
}

type TierDetails = {
  name: string;
  className: string;
  gradient: string;
};

export function QuizResults({ score, results }: QuizResultsProps) {
  const tierDetails: TierDetails = useMemo(() => {
    switch (results.tier) {
      case "Ouro":
        return {
          name: "Ouro",
          className: "bg-yellow-400 text-yellow-900 border-yellow-500",
          gradient: "from-amber-400 to-yellow-500",
        };
      case "Prata":
        return {
          name: "Prata",
          className: "bg-slate-300 text-slate-800 border-slate-400",
          gradient: "from-slate-300 to-slate-400",
        };
      case "Bronze":
      default:
        return {
          name: "Bronze",
          className: "bg-orange-400 text-orange-900 border-orange-500",
          gradient: "from-orange-500 to-amber-600",
        };
    }
  }, [results.tier]);

  return (
    <div className="animate-fade-in text-foreground">
      <div
        className={`bg-gradient-to-br ${tierDetails.gradient} text-background p-6 rounded-xl text-center mb-8 shadow-lg`}
      >
        <p className="text-lg font-semibold opacity-90">Seu Score de Prontidão para IA</p>
        <p className="text-7xl font-bold font-headline my-2">{score.toFixed(1)}/10</p>
        <p className="opacity-90 max-w-md mx-auto mb-4">{results.readinessStatement}</p>
        <Badge
          variant="outline"
          className={`text-lg px-4 py-1 border-2 bg-background/20 backdrop-blur-sm text-foreground`}
        >
          🏆 Sua Classificação: {results.tier}
        </Badge>
      </div>
      
      <p className="text-center text-muted-foreground text-lg mb-6">{results.tierDescription}</p>

      <Card className="mb-8 bg-secondary/30 border-primary/30">
        <CardContent className="p-4 text-center">
            <p className="font-semibold text-lg text-primary">{results.benchmarkStatement}</p>
        </CardContent>
      </Card>


      <h2 className="text-3xl font-headline font-bold text-center mb-6 text-primary">
        Suas 3 Melhores Oportunidades
      </h2>

      <div className="space-y-6">
        {results.opportunities.map((opp, index) => (
          <Card key={index} className="overflow-hidden border-l-4 border-primary bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary flex items-center gap-2"><CheckCircle className="w-6 h-6"/>{opp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-base text-muted-foreground">{opp.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                 <div className="bg-secondary/50 p-3 rounded-lg flex items-center gap-3">
                    <Target className="w-8 h-8 text-accent-foreground"/>
                    <div>
                        <p className="font-semibold text-muted-foreground">ROI Estimado</p>
                        <p className="font-bold text-lg text-foreground">{opp.estimatedRoi}</p>
                    </div>
                 </div>
                 <div className="bg-secondary/50 p-3 rounded-lg flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-accent-foreground"/>
                    <div>
                        <p className="font-semibold text-muted-foreground">Tempo</p>
                        <p className="font-bold text-lg text-foreground">{opp.implementationTime}</p>
                    </div>
                 </div>
                 <div className="bg-secondary/50 p-3 rounded-lg flex items-center gap-3">
                    <BarChart className="w-8 h-8 text-accent-foreground"/>
                    <div>
                        <p className="font-semibold text-muted-foreground">Investimento</p>
                        <p className="font-bold text-lg text-foreground">{opp.investmentRange}</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center bg-card/80 p-8 rounded-xl border border-primary/30 shadow-xl">
         <h3 className="text-2xl font-headline font-bold text-foreground">Seu Próximo Passo Ideal</h3>
         <div className="mt-4">
            <Button size="lg" className="font-bold text-lg py-7 px-8 font-headline">
                {results.nextStepCallToAction}
                <ArrowRight className="ml-2"/>
            </Button>
         </div>
      </div>
    </div>
  );
}
