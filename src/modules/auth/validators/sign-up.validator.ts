import { baseValidator } from '@/common/validators/zod';
import { z } from 'zod';

export const signUpValidator = z
  .object({
    name: baseValidator.userName,
    email: baseValidator.email,
    password: baseValidator.password,
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'validator_user_password_do_not_match',
    path: ['confirmPassword']
  });
