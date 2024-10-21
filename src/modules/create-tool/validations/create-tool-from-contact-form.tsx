import { functions } from 'lodash-es';
import { z } from 'zod';

export const CreateToolFromContactFormSchema = z.object({
  address: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(66, 'Name must not exceed 66 characters')
    .trim(),
  functions: z.array(z.string().min(1, 'Functions must be at least 1 characters long')),
  packages: z.array(z.string().min(1, 'Packages must be at least 1 characters long')),
  modules: z.array(z.string().min(1, 'Modules must be at least 1 characters long'))
});
