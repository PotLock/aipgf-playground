import { baseValidator } from '@/common/validators/zod';
import { z } from 'zod';

export const signInValidator = z.object({
  email: baseValidator.email,
  password: baseValidator.password
});
