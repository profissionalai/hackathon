'use server';

/**
 * @fileOverview Generates personalized AI opportunities based on questionnaire responses.
 *
 * - generateOpportunities - A function that generates personalized AI opportunities.
 * - GenerateOpportunitiesInput - The input type for the generateOpportunities function.
 * - GenerateOpportunitiesOutput - The return type for the generateOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOpportunitiesInputSchema = z.object({
  questionnaireResponses: z
    .record(z.string(), z.any())
    .describe('A map of questionnaire responses.'),
  aiReadinessScore: z.number().describe('The AI readiness score of the business.'),
  userEmail: z.string().describe('The user\'s email address.'),
  sector: z.string().describe('The business sector.'),
  painPoint: z.string().describe('The main pain point of the business.'),
});
export type GenerateOpportunitiesInput = z.infer<typeof GenerateOpportunitiesInputSchema>;

const OpportunitySchema = z.object({
  title: z.string().describe('The title of the AI opportunity. Must be concise and compelling.'),
  description: z.string().describe('A detailed description of the AI opportunity, explaining how it solves the user\'s problem.'),
  estimatedRoi: z.string().describe('The estimated return on investment (ROI) for this opportunity (e.g., "150-200%", "Redução de 30% nos custos").'),
  implementationTime: z.string().describe('The estimated time to implement this opportunity (e.g., "2-3 meses").'),
  investmentRange: z.string().describe('An estimated investment range for this opportunity (e.g., "R$ 30k - R$ 50k").'),
});

const GenerateOpportunitiesOutputSchema = z.object({
  opportunities: z.array(OpportunitySchema).describe('An array of three personalized AI opportunities, tailored to the user\'s sector and pain point.'),
  readinessStatement: z.string().describe('A statement about the company\'s AI readiness based on their score (e.g., "muito bem posicionada para adotar IA").'),
  tier: z.enum(["Ouro", "Prata", "Bronze"]).describe('The user\'s classification tier (Ouro, Prata, Bronze).'),
  tierDescription: z.string().describe('A personalized description for the user\'s tier, considering their sector and pain point.'),
  benchmarkStatement: z.string().describe('A benchmark statement comparing the user\'s company to others in their sector (e.g., "Você está melhor que 75% das empresas de Varejo em prontidão para IA").'),
  nextStepCallToAction: z.string().describe('The personalized next step call-to-action based on the user\'s tier.'),
});
export type GenerateOpportunitiesOutput = z.infer<typeof GenerateOpportunitiesOutputSchema>;

export async function generateOpportunities(
  input: GenerateOpportunitiesInput
): Promise<GenerateOpportunitiesOutput> {
  return generateOpportunitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOpportunitiesPrompt',
  input: {schema: GenerateOpportunitiesInputSchema},
  output: {schema: GenerateOpportunitiesOutputSchema},
  prompt: `You are an expert AI consultant for a company called "IA Hunter". Your goal is to create a personalized AI diagnostic report based on a user's questionnaire answers.

  **Context:**
  - **User Email:** {{{userEmail}}}
  - **Business Sector:** {{{sector}}}
  - **Main Pain Point:** {{{painPoint}}}
  - **AI Readiness Score:** {{{aiReadinessScore}}} / 10
  - **Full Questionnaire Responses:** {{{json questionnaireResponses}}}

  **Your Task:**

  Generate a complete, personalized report in Brazilian Portuguese. Follow these steps precisely:

  1.  **Determine Tier:** Based on the \`aiReadinessScore\`, classify the user into a tier:
      *   **8.0 - 10.0:** "Ouro"
      *   **6.0 - 7.9:** "Prata"
      *   **0.0 - 5.9:** "Bronze"

  2.  **Create AI Readiness Statement:** Write a brief statement reflecting their score.
      *   Example for score 8.5: "Sua empresa está muito bem posicionada para adotar IA."
      *   Example for score 6.5: "Sua empresa está bem posicionada para iniciar sua jornada em IA."
      *   Example for score 4.5: "Sua empresa está nos estágios iniciais de preparação para a IA, com grande potencial de crescimento."

  3.  **Write Tier Description:** Create a personalized description for their tier, incorporating their sector and main pain point.
      *   Example for Ouro Tier, Retail, Sales pain: "Como uma empresa de Varejo no tier Ouro, você tem uma base sólida para resolver seus desafios de vendas com IA de ponta."

  4.  **Generate 3 Personalized Opportunities:** Create three distinct, actionable AI opportunities.
      *   **Opportunity 1 (Primary):** Must directly address the user's main \`painPoint\`.
      *   **Opportunity 2 (Secondary):** Should be highly relevant to the user's \`sector\`.
      *   **Opportunity 3 (Future Growth):** Suggest a more advanced or long-term AI application for their business.
      *   For each opportunity, provide a compelling \`title\`, a clear \`description\`, an estimated \`estimatedRoi\`, an \`implementationTime\`, and an \`investmentRange\`.

  5.  **Create Benchmark Statement:** Compare their readiness to others in their sector. Be creative and encouraging.
      *   Example for score 7.2, Technology sector: "Você está à frente de aproximadamente 65% das empresas de Tecnologia em termos de prontidão para IA."

  6.  **Define Next Step CTA:** Based on the tier, provide the specific call-to-action.
      *   **Ouro:** "Agende sua sessão estratégica gratuita"
      *   **Prata:** "Vamos conversar sobre suas oportunidades"
      *   **Bronze:** "Comece com nosso Workshop IA para Gestores"

  Format the entire output as a single JSON object matching the provided schema.
  `,
});

const generateOpportunitiesFlow = ai.defineFlow(
  {
    name: 'generateOpportunitiesFlow',
    inputSchema: GenerateOpportunitiesInputSchema,
    outputSchema: GenerateOpportunitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
