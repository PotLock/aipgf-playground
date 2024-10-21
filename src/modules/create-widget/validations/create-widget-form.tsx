import { z } from 'zod';

export const CreateWidgetFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .max(200, 'Description must not exceed 50 characters')
    .trim(),
  tag: z.string().min(2, 'Tag must be at least 2 characters long').max(50, 'Tag must not exceed 50 characters').trim(),
  prompt: z
    .string()
    .min(2, 'Prompt must be at least 2 characters long')
    .max(500, 'Prompt must not exceed 50 characters')
    .trim(),
  tool: z
    .string()
    .min(2, 'Tool must be at least 2 characters long')
    .max(50, 'Tool must not exceed 50 characters')
    .trim()
});
