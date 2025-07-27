import { BarChart, CheckCircle, Lightbulb, Rocket } from 'lucide-react';

const benefits = [
  { icon: CheckCircle, text: 'Score de Prontidão para IA' },
  { icon: Lightbulb, text: '3 Oportunidades Personalizadas' },
  { icon: BarChart, text: 'ROI Estimado' },
  { icon: Rocket, text: 'Próximo Passo Recomendado' },
];

export function QuizHeader() {
  return (
    <header className="bg-gradient-to-br from-primary to-[#21CBF3] text-primary-foreground p-8 md:p-10 text-center">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-3">🎯 Diagnóstico IA Hunter</h1>
      <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
        Descubra em 3 minutos as melhores oportunidades de IA para seu negócio!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
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
    </header>
  );
}
