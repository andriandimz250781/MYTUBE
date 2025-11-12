'use server';

/**
 * @fileOverview AI-powered video tagging flow.
 *
 * This file defines a Genkit flow that automatically generates relevant tags for uploaded videos using AI.
 * The tags help video creators save time and improve the discoverability of their content.
 *
 * @exports generateTags - A function that triggers the AI-powered tagging flow.
 * @exports GenerateTagsInput - The input type for the generateTags function.
 * @exports GenerateTagsOutput - The return type for the generateTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTagsInputSchema = z.object({
  videoTitle: z.string().describe('The title of the video.'),
  videoDescription: z.string().describe('A description of the video content.'),
  videoDataUri: z
    .string()
    .describe(
      'A frame from the video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type GenerateTagsInput = z.infer<typeof GenerateTagsInputSchema>;

const GenerateTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of relevant tags for the video.'),
});
export type GenerateTagsOutput = z.infer<typeof GenerateTagsOutputSchema>;

export async function generateTags(input: GenerateTagsInput): Promise<GenerateTagsOutput> {
  return generateTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTagsPrompt',
  input: {schema: GenerateTagsInputSchema},
  output: {schema: GenerateTagsOutputSchema},
  prompt: `You are an expert in generating video tags. Given the video title, description, and a frame from the video, generate a list of relevant tags.

Title: {{{videoTitle}}}
Description: {{{videoDescription}}}
Video Frame: {{media url=videoDataUri}}

Tags:`, //Crucially, it MUST be formatted using Handlebars syntax. Do not use Jinja, Django templates, or any other templating language.
});

const generateTagsFlow = ai.defineFlow(
  {
    name: 'generateTagsFlow',
    inputSchema: GenerateTagsInputSchema,
    outputSchema: GenerateTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
