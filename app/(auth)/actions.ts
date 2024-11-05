'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/db/queries';

import { signIn } from './auth';

const authFormSchema = z.object({
  username: z.string().min(6),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      username: validatedData.username,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    let [user] = await getUser(validatedData.username);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    } else {
      await createUser(validatedData.username, validatedData.password);
      await signIn('credentials', {
        username: validatedData.username,
        password: validatedData.password,
        redirect: false,
      });

      return { status: 'success' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
export interface AuthenticateActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'invalid_data'
    | 'user_exists';
}
export const authenticate = async (
  _: AuthenticateActionState,
  formData: FormData
): Promise<AuthenticateActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      username: formData.get('username'),
      password: formData.get('password'),
    });
    let [user] = await getUser(validatedData.username);

    if (user) {
      await signIn('credentials', {
        username: validatedData.username,
        password: validatedData.password,
        redirect: false,
      });
      return { status: 'success' };
    } else {
      await createUser(validatedData.username, validatedData.password);
      await signIn('credentials', {
        username: validatedData.username,
        password: validatedData.password,
        redirect: false,
      });

      return { status: 'success' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
