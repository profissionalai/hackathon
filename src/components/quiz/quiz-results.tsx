"use client";

import { useMemo } from "react";
import type { GenerateOpportunitiesOutput } from "@/ai/flows/generate-opportunities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuizResultsProps {
  score: number;
  opportunities: GenerateOpportunitiesOutput["opportunities"];
}

type Tier = {
  name: string;
  className: string;
  gradient: string;
};

export function QuizResults({ score, opportunities }: QuizResultsProps) {
  const tier: Tier = useMemo(() => {
    if (score >= 80) {
      return {
        name: "Ouro",
        className: "bg-yellow-400 text-yellow-900 border-yellow-500",
        gradient: "from-yellow-400 to-amber-500",
      };
    }
    if (score >= 50) {
      return {
        name: "Prata",
        className: "bg-slate-300 text-slate-800 border-slate-400",
        gradient: "from-slate-300 to-slate-400",
      };
    }
    return {
      name: "Bronze",
      className: "bg-orange-400 text-orange-900 border-orange-500",
      gradient: "from-orange-400 to-amber-600",
    };
  }, [score]);

  return (
    <div className="animate-fade-in">
      <div
        className={`bg-gradient-to-br ${tier.gradient} text-white p-6 rounded-xl text-center mb-8 shadow-lg`}
      >
        <p className="text-lg font-semibold opacity-90">Sua Pontuação de Prontidão para IA</p>
        <p className="text-7xl font-bold font-headline my-2">{score}</p>
        <Badge
          className={`text-lg px-4 py-1 border-2 ${tier.className} bg-clip-text text-transparent`}
          style={{ backgroundImage: `linear-gradient(135deg, white, white)`, WebkitBackgroundClip: 'text' }}
        >
          {tier.name}
        </Badge>
      </div>

      <h2 className="text-3xl font-headline font-bold text-center mb-6 text-foreground">
        Suas Oportunidades de IA Personalizadas
      </h2>

      <div className="space-y-6">
        {opportunities.map((opp, index) => (
          <Card key={index} className="overflow-hidden border-l-4 border-primary">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">{opp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-base text-muted-foreground">{opp.description}</CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">ROI Estimado</p>
                    <p className="text-lg font-bold text-accent">{opp.estimatedRoi}</p>
                 </div>
                 <div className="bg-secondary/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Próximos Passos</p>
                    <p className="text-base text-foreground">{opp.nextSteps}</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
