'use server';
import { z } from 'zod';
import { generateTags } from '@/ai/flows/ai-powered-tagging';

export interface TagGenerationState {
    message: string | null;
    tags: string[];
    errors?: {
        videoTitle?: string[];
        videoDescription?: string[];
        videoDataUri?: string[];
        server?: string;
    };
}

const FormSchema = z.object({
    videoTitle: z.string().min(1, 'Title is required.'),
    videoDescription: z.string().min(1, 'Description is required.'),
    videoDataUri: z.string().min(1, 'Video frame is required for AI processing.'),
});

export async function getAiTags(prevState: TagGenerationState, formData: FormData): Promise<TagGenerationState> {
    const validatedFields = FormSchema.safeParse({
        videoTitle: formData.get('videoTitle'),
        videoDescription: formData.get('videoDescription'),
        videoDataUri: formData.get('videoDataUri'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Validation failed. Please check the fields.',
            tags: [],
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    try {
        const result = await generateTags(validatedFields.data);
        return { message: "Tags generated successfully!", tags: result.tags };
    } catch (error) {
        console.error("Error generating tags:", error);
        return { message: "AI generation failed. Please try again.", tags: [], errors: { server: 'An unexpected error occurred.'} };
    }
}
