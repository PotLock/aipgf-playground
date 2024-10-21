import { z } from 'zod';

import { loginFormSchema } from '../validations/login-form';

export type LoginFormData = z.infer<typeof loginFormSchema>;
