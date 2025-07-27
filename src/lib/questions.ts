export interface QuestionOption {
  text: string;
  emoji: string;
  value: number;
}

export interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: "dataMaturity",
    title: "Maturidade dos Dados",
    subtitle: "Qual o nível de organização e acesso aos dados da sua empresa?",
    options: [
      { text: "Dados descentralizados e pouco estruturados.", emoji: "🗂️", value: 5 },
      { text: "Temos alguns processos, mas ainda é manual.", emoji: "📊", value: 10 },
      { text: "Dados centralizados e em processo de estruturação.", emoji: "📈", value: 15 },
      { text: "Dados bem estruturados e acessíveis via dashboards.", emoji: "🎯", value: 20 },
    ],
  },
  {
    id: "automationLevel",
    title: "Nível de Automação Atual",
    subtitle: "Quão automatizados são os processos chave da sua operação?",
    options: [
      { text: "Processos 100% manuais.", emoji: "✍️", value: 5 },
      { text: "Usamos planilhas e algumas ferramentas básicas.", emoji: "📋", value: 10 },
      { text: "Alguns processos são automatizados com software.", emoji: "⚙️", value: 15 },
      { text: "Temos automações integradas e fluxos de trabalho eficientes.", emoji: "🚀", value: 20 },
    ],
  },
  {
    id: "businessGoal",
    title: "Principal Objetivo de Negócio",
    subtitle: "O que você mais busca melhorar com novas tecnologias?",
    options: [
      { text: "Reduzir custos operacionais.", emoji: "💰", value: 10 },
      { text: "Aumentar a eficiência e produtividade.", emoji: "⚡", value: 10 },
      { text: "Melhorar a experiência do cliente.", emoji: "❤️", value: 10 },
      { text: "Inovar e criar novas fontes de receita.", emoji: "💡", value: 10 },
    ],
  },
  {
    id: "techExpertise",
    title: "Expertise Técnica",
    subtitle: "Qual o nível de conhecimento técnico da sua equipe?",
    options: [
      { text: "Nenhuma expertise técnica interna.", emoji: "🤔", value: 5 },
      { text: "Temos entusiastas de tecnologia, mas sem especialização.", emoji: "🤓", value: 10 },
      { text: "Temos uma pequena equipe de TI ou um profissional dedicado.", emoji: "👨‍💻", value: 15 },
      { text: "Equipe de TI/desenvolvimento experiente e estruturada.", emoji: "👩‍🚀", value: 20 },
    ],
  },
  {
    id: "investmentBudget",
    title: "Orçamento para Inovação",
    subtitle: "Qual a sua capacidade de investimento em novas tecnologias?",
    options: [
      { text: "Orçamento muito limitado ou inexistente.", emoji: "💸", value: 5 },
      { text: "Aberto a pequenos investimentos pontuais.", emoji: "🌱", value: 10 },
      { text: "Orçamento definido para projetos de inovação.", emoji: "🏦", value: 15 },
      { text: "Investimento estratégico e contínuo em tecnologia.", emoji: "💎", value: 20 },
    ],
  },
];
