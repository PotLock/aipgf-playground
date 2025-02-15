'use server';

import { put } from '@vercel/blob';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { removeModelById, updateModel } from '@/db/queries';


const updateModelFormSchema = z.object({
  id: z.string(),
  modelName: z.string().min(4),
  endpoint: z.string().url(),
  apiToken: z.string(),
});


export interface UpdateModelActionState {
  status:
  | 'idle'
  | 'in_progress'
  | 'success'
  | 'failed'
  | 'model_exists'
  | 'invalid_data';
}


export const updateModelAction = async (
  _: UpdateModelActionState,
  formData: FormData
): Promise<UpdateModelActionState> => {
  try {
    const session = await auth();
    const validatedData = updateModelFormSchema.parse({
      id: formData.get('id')  ,
      modelName: formData.get('modelName'),
      endpoint: formData.get('endpoint'),
      apiToken: formData.get('apiToken'),
    });

    const result = await updateModel(validatedData as any);

    if (result) {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  } catch (error) {
    console.error('Failed to update model', error);
    if (error instanceof z.ZodError) {
      console.log('invalid data',error);
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};

