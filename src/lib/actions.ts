'use server';

import { generateTags, type GenerateTagsInput } from '@/ai/flows/ai-powered-tagging';
import { z } from 'zod';

const FormSchema = z.object({
  videoTitle: z.string().min(1, 'Title is required.'),
  videoDescription: z.string().min(1, 'Description is required.'),
  videoDataUri: z.string(),
});

export type TagGenerationState = {
  message?: string | null;
  tags?: string[];
  errors?: {
    videoTitle?: string[];
    videoDescription?: string[];
    videoDataUri?: string[];
    server?: string[];
  };
};

export async function getAiTags(
  prevState: TagGenerationState,
  formData: FormData
): Promise<TagGenerationState> {
  const validatedFields = FormSchema.safeParse({
    videoTitle: formData.get('videoTitle'),
    videoDescription: formData.get('videoDescription'),
    videoDataUri: formData.get('videoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input. Failed to generate tags.',
    };
  }

  const { videoTitle, videoDescription, videoDataUri } = validatedFields.data;

  if (!videoDataUri || videoDataUri === 'null' || videoDataUri === '') {
    return {
      message: 'Please select a video file to generate a thumbnail.',
      errors: { server: ['Please select a video file to generate a thumbnail.'] },
    };
  }

  try {
    const input: GenerateTagsInput = {
      videoTitle,
      videoDescription,
      videoDataUri,
    };

    const result = await generateTags(input);

    if (result.tags && result.tags.length > 0) {
      return { message: 'Tags generated successfully!', tags: result.tags };
    } else {
      return {
        message: 'AI could not generate tags. Please add them manually.',
        tags: [],
      };
    }
  } catch (e) {
    console.error(e);
    return {
      message: 'An unexpected error occurred on the server.',
      errors: {
        server: ['An unexpected error occurred. Please try again.'],
      },
    };
  }
}
