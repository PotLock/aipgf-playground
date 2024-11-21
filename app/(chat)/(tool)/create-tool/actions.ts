'use server';

import { put } from '@vercel/blob';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { createTool } from '@/db/queries';

const createToolFormSchema = z.object({
  name: z.string().min(4),
  avatar: z.any(),
  description: z.string().min(4),
  typeName: z.string(),
  data: z.string(),
});

export interface CreateToolActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'tool_exists'
    | 'invalid_data';
}
export const createToolAction = async (
  _: CreateToolActionState,
  formData: FormData
): Promise<CreateToolActionState> => {
  console.log(formData.get('avatar'));
  try {
    const session = await auth();
    const imageFile = formData.get('avatar') as File;

    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    });

    const validatedData = createToolFormSchema.parse({
      avatar: blob,
      name: formData.get('name'),
      description: formData.get('description'),
      data: formData.get('data'),
      typeName: formData.get('typeName'),
    });
    await createTool({
      name: validatedData.name,
      avatar: validatedData.avatar.url,
      description: validatedData.description,
      data: validatedData.data,
      typeName: validatedData.typeName,
      createdAt: new Date(),
      userId: session?.user?.id,
    } as any);

    return { status: 'success' };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
