'use server';

import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';
import { createProvider } from '@/db/queries';

const createProviderFormSchema = z.object({
  modelName: z.string().min(4),
  endpoint: z.string().url(),
  apiToken: z.string().min(4),
});

export interface CreateProviderActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const createProviderAction = async (
  _: CreateProviderActionState,
  formData: FormData
): Promise<CreateProviderActionState> => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return { status: 'failed' };
    }

    const validatedData = createProviderFormSchema.parse({
      modelName: formData.get('modelName'),
      endpoint: formData.get('endpoint'),
      apiToken: formData.get('apiToken'),
    });

    await createProvider({
      userId: session.user.id as string,
      modelName: validatedData.modelName,
      endpoint: validatedData.endpoint,
      apiToken: validatedData.apiToken,
    });

    return { status: 'success' };
  } catch (error) {
    console.error('Failed to create provider:', error);
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};