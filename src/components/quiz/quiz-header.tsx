import { BarChart, CheckCircle, Lightbulb, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const benefits = [
  { icon: CheckCircle, text: 'Score de Prontidão para IA' },
  { icon: Lightbulb, text: '3 Oportunidades Personalizadas' },
  { icon: BarChart, text: 'ROI Estimado por Aplicação' },
  { icon: Rocket, text: 'Próximo Passo Recomendado' },
];

export function QuizHeader({ isQuizStarted }: { isQuizStarted: boolean }) {
  return (
    <header className="bg-gradient-to-br from-primary to-[#21CBF3] text-primary-foreground p-8 md:p-10 text-center transition-all duration-500">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3">🎯 Diagnóstico IA Hunter</h1>
      <div className={cn("transition-all duration-500 overflow-hidden", isQuizStarted ? "max-h-0 opacity-0 mb-0" : "max-h-96 opacity-100 mb-8")}>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Descubra em 3 minutos as melhores oportunidades de IA para seu negócio!
        </p>
      </div>
      <div className={cn("transition-all duration-500 overflow-hidden", isQuizStarted ? "max-h-0 opacity-0" : "max-h-96 opacity-100")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center text-sm font-medium"
            >
              <benefit.icon className="w-8 h-8 mb-2" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
