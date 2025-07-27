export type Answer = {
  text: string;
  emoji?: string;
  value: number; // Original value, might not be used in new scoring
  points: number; // Points for the new scoring system
}

export interface Question {
  id: 'sector' | 'size' | 'role' | 'pain' | 'painSub' | 'quantifyPain' | 'maturity' | 'investment' | 'urgency';
  type: 'multiple-choice' | 'text';
  title: string;
  conversationalTitle: string;
  options?: Answer[];
  // For conditional questions
  dependsOn?: string;
  showIf?: (value: string) => boolean;
}

export type Answers = Record<string, Answer>;

export const allQuestions: Question[] = [
  // Block 1: Company Context
  {
    id: "sector",
    type: "multiple-choice",
    title: "Setor da Empresa",
    conversationalTitle: "Para te dar recomendações mais precisas, me conta em qual área sua empresa trabalha?",
    options: [
      { text: "Indústria/Manufatura", emoji: "🏭", value: 1, points: 1 },
      { text: "Varejo/E-commerce", emoji: "🛒", value: 2, points: 1 },
      { text: "Serviços Profissionais", emoji: "💼", value: 3, points: 1 },
      { text: "Saúde/Medicina", emoji: "🏥", value: 4, points: 1 },
      { text: "Educação", emoji: "📚", value: 5, points: 1 },
      { text: "Financeiro/Fintech", emoji: "🏦", value: 6, points: 1 },
      { text: "Logística/Supply Chain", emoji: "🚚", value: 7, points: 1 },
      { text: "Construção/Imobiliário", emoji: "🏗️", value: 8, points: 1 },
      { text: "Tecnologia/Software", emoji: "🎮", value: 9, points: 1 },
      { text: "Alimentação/Restaurantes", emoji: "🍕", value: 10, points: 1 },
      { text: "Marketing/Agências", emoji: "🎨", value: 11, points: 1 },
      { text: "Recursos Humanos", emoji: "👥", value: 12, points: 1 },
      { text: "Consultoria Empresarial", emoji: "📊", value: 13, points: 1 },
      { text: "Agronegócios", emoji: "🌾", value: 14, points: 1 },
      { text: "Manutenção/Serviços Técnicos", emoji: "🔧", value: 15, points: 1 },
      { text: "Outros", emoji: "🌐", value: 16, points: 1 },
    ],
  },
  {
    id: "size",
    type: "multiple-choice",
    title: "Porte da Empresa",
    conversationalTitle: "E qual o tamanho da equipe? Isso me ajuda a entender a complexidade dos desafios.",
    options: [
      { text: "1-10 funcionários", emoji: "👥", value: 1, points: 1 },
      { text: "11-50 funcionários", emoji: "👥", value: 2, points: 2 },
      { text: "51-250 funcionários", emoji: "👥", value: 3, points: 3 },
      { text: "251-500 funcionários", emoji: "👥", value: 4, points: 4 },
      { text: "+500 funcionários", emoji: "👥", value: 5, points: 5 },
    ],
  },
  {
    id: "role",
    type: "multiple-choice",
    title: "Papel na Empresa",
    conversationalTitle: "E você, qual sua função na empresa? Isso é importante para eu entender seu nível de decisão.",
    options: [
      { text: "Sócio(a)/CEO/Fundador(a)", emoji: "👑", value: 1, points: 3 },
      { text: "Diretor(a)/C-Level", emoji: "🎯", value: 2, points: 2.5 },
      { text: "Gerente/Coordenador(a)", emoji: "📊", value: 3, points: 2 },
      { text: "Analista/Especialista", emoji: "⚙️", value: 4, points: 1 },
      { text: "Estagiário/Trainee", emoji: "🎓", value: 5, points: 0.5 },
      { text: "Consultor/Freelancer", emoji: "🤝", value: 6, points: 1.5 },
    ],
  },
  // Block 2: Pain Diagnosis
  {
    id: "pain",
    type: "multiple-choice",
    title: "Gargalo Principal",
    conversationalTitle: "Agora vamos ao que interessa! Qual é o maior gargalo que impede sua empresa de ser mais eficiente ou crescer mais rápido hoje?",
    options: [
      { text: "Processos manuais e repetitivos", emoji: "🔄", value: 1, points: 2 },
      { text: "Perda de oportunidades de venda", emoji: "💸", value: 2, points: 2 },
      { text: "Custos operacionais muito altos", emoji: "💰", value: 3, points: 2 },
      { text: "Dificuldade em entender clientes", emoji: "🎯", value: 4, points: 2 },
      { text: "Tomada de decisão lenta ou baseada em 'achismo'", emoji: "📊", value: 5, points: 2 },
      { text: "Atendimento ao cliente demorado/ineficiente", emoji: "😤", value: 6, points: 2 },
      { text: "Dificuldade em contratar ou reter bons talentos", emoji: "👥", value: 7, points: 1 },
      { text: "Problemas de compliance/regulamentação", emoji: "📋", value: 8, points: 1 },
      { text: "Não temos grandes gargalos no momento", emoji: "🚫", value: 9, points: 0 },
    ],
  },
  {
    id: "quantifyPain",
    type: "multiple-choice",
    title: "Quantificação da Dor",
    conversationalTitle: "Você consegue estimar quanto esse problema está custando para empresa (em tempo ou dinheiro perdido)?",
    options: [
        { text: "Sim, é um custo significativo (>R$ 10k/mês)", emoji: "💸", value: 1, points: 3 },
        { text: "Sim, é um custo moderado (<R$ 10k/mês)", emoji: "💰", value: 2, points: 2.5 },
        { text: "Temos uma estimativa do tempo perdido", emoji: "⏳", value: 3, points: 2.5 },
        { text: "Não consigo medir, mas o impacto é alto", emoji: "🤔", value: 4, points: 2 },
    ]
  },
  // Block 3: Resources
  {
    id: "maturity",
    type: "multiple-choice",
    title: "Maturidade Digital",
    conversationalTitle: "Para te dar a recomendação mais certeira, como vocês usam dados para tomar decisões hoje?",
    options: [
      { text: "Principalmente na intuição", emoji: "🤔", value: 1, points: 0 },
      { text: "Usamos relatórios básicos e planilhas", emoji: "📊", value: 2, points: 0.5 },
      { text: "Temos sistemas centralizados (CRM/ERP)", emoji: "🏢", value: 3, points: 1 },
      { text: "Temos cultura de dados, com dashboards e BI", emoji: "📈", value: 4, points: 1.5 },
      { text: "Já usamos alguns insights automatizados/IA", emoji: "🤖", value: 5, points: 2 },
    ],
  },
  {
    id: "investment",
    type: "multiple-choice",
    title: "Capacidade de Investimento",
    conversationalTitle: "Pensando em um projeto estratégico que traga retorno claro, qual seria uma faixa de investimento viável nos próximos 12 meses?",
    options: [
      { text: "Estamos em fase de estudo, sem orçamento", emoji: "🔍", value: 1, points: 0.5 },
      { text: "Até R$ 30.000", emoji: "💰", value: 2, points: 1 },
      { text: "Entre R$ 30.000 e R$ 100.000", emoji: "💰", value: 3, points: 2 },
      { text: "Entre R$ 100.000 e R$ 300.000", emoji: "💰", value: 4, points: 2.5 },
      { text: "Acima de R$ 300.000", emoji: "💰", value: 5, points: 3 },
      { text: "Dependeria do ROI demonstrado", emoji: "❓", value: 6, points: 1.5 },
    ],
  },
  {
    id: "urgency",
    type: "multiple-choice",
    title: "Urgência",
    conversationalTitle: "E qual a urgência para começar a resolver esse gargalo principal que me contou?",
    options: [
      { text: "Crítica! Para ontem", emoji: "🔥", value: 1, points: 2 },
      { text: "Alta - Próximos 3 meses", emoji: "⚡", value: 2, points: 1.5 },
      { text: "Média - Próximos 6-12 meses", emoji: "📅", value: 3, points: 1 },
      { text: "Baixa - Apenas pesquisando", emoji: "🔍", value: 4, points: 0.5 },
      { text: "Vai depender da proposta", emoji: "❓", value: 5, points: 1 },
    ],
  },
];

const painSubQuestions: Record<string, Question> = {
  "Processos manuais e repetitivos": {
    id: "painSub",
    type: "multiple-choice",
    title: "Área Crítica (Processos Manuais)",
    conversationalTitle: "Interessante! E em qual área esses processos manuais são mais críticos?",
    options: [
      { text: "Atendimento ao Cliente", emoji: "🔄", value: 1, points: 1 },
      { text: "Marketing/Campanhas", emoji: "📊", value: 2, points: 1 },
      { text: "Vendas/Propostas", emoji: "💰", value: 3, points: 1 },
      { text: "Financeiro/Cobrança", emoji: "📋", value: 4, points: 1 },
      { text: "Recursos Humanos", emoji: "👥", value: 5, points: 1 },
      { text: "Operações/Logística", emoji: "📦", value: 6, points: 1 },
    ],
  },
  "Perda de oportunidades de venda": {
    id: "painSub",
    type: "multiple-choice",
    title: "Área Crítica (Vendas)",
    conversationalTitle: "Entendido. E onde no funil de vendas a perda é maior?",
    options: [
      { text: "Geração de Leads", emoji: "🎯", value: 1, points: 1 },
      { text: "Qualificação de Leads", emoji: "🔍", value: 2, points: 1 },
      { text: "Fechamento de Vendas", emoji: "💼", value: 3, points: 1 },
      { text: "Retenção de Clientes", emoji: "🔄", value: 4, points: 1 },
      { text: "Análise de Performance", emoji: "📊", value: 5, points: 1 },
    ],
  },
  "Custos operacionais muito altos": {
    id: "painSub",
    type: "multiple-choice",
    title: "Área Crítica (Custos)",
    conversationalTitle: "Ok. Em qual área específica esses custos estão mais altos?",
    options: [
      { text: "Folha de Pagamento", emoji: "👥", value: 1, points: 1 },
      { text: "Logística/Entrega", emoji: "📦", value: 2, points: 1 },
      { text: "Produção/Manufatura", emoji: "🏭", value: 3, points: 1 },
      { text: "Atendimento/Suporte", emoji: "📞", value: 4, points: 1 },
      { text: "Marketing/Aquisição", emoji: "🎯", value: 5, points: 1 },
    ],
  },
   "Tomada de decisão lenta ou baseada em 'achismo'": {
    id: "painSub",
    type: "multiple-choice",
    title: "Área Crítica (Dados)",
    conversationalTitle: "Compreendo. E a falta de dados para decisão impacta mais qual área?",
    options: [
        { text: "Vendas/Performance", emoji: "💰", value: 1, points: 1 },
        { text: "Marketing/ROI", emoji: "🎯", value: 2, points: 1 },
        { text: "Operações/Eficiência", emoji: "💼", value: 3, points: 1 },
        { text: "RH/Produtividade", emoji: "👥", value: 4, points: 1 },
        { text: "Financeiro/Lucratividade", emoji: "💸", value: 5, points: 1 },
    ],
  }
};

const quantifiablePains = [
    "Processos manuais e repetitivos",
    "Perda de oportunidades de venda",
    "Custos operacionais muito altos",
];

export function isPainQuestion(id: string): id is 'pain' {
    return id === 'pain';
}

export function getPainSubQuestion(painAnswerText: string): Question | null {
    return painSubQuestions[painAnswerText] || null;
}

export function isQuantifiablePain(painAnswerText: string): boolean {
    return quantifiablePains.includes(painAnswerText);
}

    