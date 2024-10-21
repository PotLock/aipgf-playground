import { z } from 'zod';

import { CreateToolFormSchema } from '../validations/create-tool-form';
import { CreateToolFromContactFormSchema } from '../validations/create-tool-from-contact-form';

export type CreateToolFormData = z.infer<typeof CreateToolFormSchema>;
export type CreateToolFromContactFormData = z.infer<typeof CreateToolFromContactFormSchema>;
