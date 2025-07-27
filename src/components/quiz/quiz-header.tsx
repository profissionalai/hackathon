import { BarChart, CheckCircle, Lightbulb, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const benefits = [
  { icon: CheckCircle, text: 'Score de Prontidão para IA' },
  { icon: Lightbulb, text: 'Oportunidades Personalizadas' },
  { icon: BarChart, text: 'ROI Estimado por Aplicação' },
  { icon: Rocket, text: 'Próximo Passo Recomendado' },
];

export function QuizHeader({ isQuizStarted }: { isQuizStarted: boolean }) {
  return (
    <header className="bg-background/80 text-foreground p-8 md:p-10 text-center transition-all duration-500">
      <div className="flex justify-center mb-3">
        <Image src="https://placehold.co/400x100.png" alt="IA Hunter Logo" width={400} height={100} data-ai-hint="logo" />
      </div>
      <div className={cn("transition-all duration-500 overflow-hidden", isQuizStarted ? "max-h-0 opacity-0 mb-0" : "max-h-96 opacity-100 mb-8")}>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-muted-foreground">
          Descubra em 3 minutos as melhores oportunidades de IA para seu negócio!
        </p>
      </div>
      <div className={cn("transition-all duration-500 overflow-hidden", isQuizStarted ? "max-h-0 opacity-0" : "max-h-96 opacity-100")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-secondary/50 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-sm font-medium"
            >
              <benefit.icon className="w-8 h-8 mb-2 text-primary" />
              <span className="text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
