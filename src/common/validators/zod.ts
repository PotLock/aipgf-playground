import { z } from 'zod';

export const baseValidator = {
  userName: stringSchema({
    min: 1,
    max: 50,
    minMessage: 'validator_user_name',
    maxMessage: 'validator_maximum_n_characters_allowed'
  }),
  email: stringSchema({
    min: 1,
    max: 320,
    minMessage: 'validator_user_email',
    maxMessage: 'validator_maximum_n_characters_allowed'
  }).email('validator_user_email_invalid'),
  password: passwordSchema(),
  seo: z.object({
    title: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 60), { message: 'validator_seo_title' }),
    description: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_description' }),
    keywords: z
      .string()
      .nullable()
      .optional()
      .refine(value => !value || (value.length >= 1 && value.length <= 150), { message: 'validator_seo_keywords' })
  })
};

interface StringValidatorOptions {
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
}

interface PasswordValidatorOptions extends StringValidatorOptions {
  pattern?: RegExp;
  patternMessage?: string;
}

interface PhoneNumberValidatorOptions {
  invalidMessage?: string;
}

export function stringSchema(options: Partial<StringValidatorOptions> = {}) {
  const {
    min = 1,
    minMessage = 'validator_at_least_n_character',
    max = 255,
    maxMessage = 'validator_maximum_n_characters_allowed'
  } = options;

  return z.string().min(min, minMessage).max(max, maxMessage);
}

export function passwordSchema(options: Partial<PasswordValidatorOptions> = {}) {
  const {
    min = 8,
    minMessage = 'validator_user_password_at_least_n_character',
    max = 255,
    maxMessage = 'validator_maximum_n_characters_allowed',
    pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    patternMessage = 'validator_user_password_rule'
  } = options;

  return z.string().min(min, minMessage).max(max, maxMessage).regex(pattern, patternMessage);
}
