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
});
export type GenerateOpportunitiesInput = z.infer<typeof GenerateOpportunitiesInputSchema>;

const OpportunitySchema = z.object({
  title: z.string().describe('The title of the AI opportunity.'),
  description: z.string().describe('A detailed description of the AI opportunity.'),
  estimatedRoi: z.string().describe('The estimated return on investment (ROI) for this opportunity.'),
  nextSteps: z.string().describe('Recommended next steps to implement this opportunity.'),
});

const GenerateOpportunitiesOutputSchema = z.object({
  opportunities: z.array(OpportunitySchema).describe('An array of personalized AI opportunities.'),
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
  prompt: `You are an AI consultant who specializes in identifying AI opportunities for businesses.

  Based on the following questionnaire responses and AI readiness score, generate three personalized AI opportunities for the business. Each opportunity should have a title, a detailed description, an estimated ROI, and recommended next steps.

  Questionnaire Responses: {{{json questionnaireResponses}}}
  AI Readiness Score: {{{aiReadinessScore}}}

  Format your response as a JSON object with an array of opportunities.
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
