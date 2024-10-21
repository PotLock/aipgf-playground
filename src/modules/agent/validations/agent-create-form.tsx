import { z } from 'zod';

import { PROMT_TYPES } from '../constants/agent-create.constant';

export const CreateAgentFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  description: z
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .max(50, 'Description must not exceed 50 characters')
    .trim(),
  tag: z.string().min(2, 'Tag must be at least 2 characters long').max(50, 'Tag must not exceed 50 characters').trim(),
  introMessage: z
    .string()
    .min(2, 'Intro message must be at least 2 characters long')
    .max(50, 'Intro message must not exceed 50 characters')
    .trim(),
  promtType: z.nativeEnum(PROMT_TYPES),
  prompt: z
    .string()
    .min(2, 'Prompt must be at least 2 characters long')
    .max(50, 'Prompt must not exceed 50 characters')
    .trim(),
  widget: z
    .string()
    .min(2, 'Widget must be at least 2 characters long')
    .max(50, 'Widget must not exceed 50 characters')
    .trim(),
  tool: z
    .string()
    .min(2, 'Tool must be at least 2 characters long')
    .max(50, 'Tool must not exceed 50 characters')
    .trim()
});
