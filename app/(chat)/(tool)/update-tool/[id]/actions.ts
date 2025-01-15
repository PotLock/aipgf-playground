'use server';

import { put } from '@vercel/blob';
import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';
import { updateTool } from '@/db/queries';

const updateToolFormSchema = z.object({
  id: z.string(),
  name: z.string().min(4),
  avatar: z.any(),
  description: z.string().min(4),
  data: z.string(),
  typeName: z.string(),
});

export interface UpdateToolActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'tool_exists'
    | 'invalid_data';
}

export const updateToolAction = async (
  _: UpdateToolActionState,
  formData: FormData
): Promise<UpdateToolActionState> => {
  try {
    const session = await auth();
    
    // Handle avatar upload if provided
    let avatarUrl: string | undefined;
    const imageFile = formData.get('avatar') as File | null;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });
      avatarUrl = blob.url;
    }

    // Validate form data
    const validatedData = updateToolFormSchema.parse({
      id: formData.get('id'),
      avatar: avatarUrl,
      name: formData.get('name'),
      description: formData.get('description'),
      data: formData.get('data') || '{}',
      typeName: formData.get('typeName'),
    });

    // Parse data JSON
    const data = JSON.parse(validatedData.data);

    // Update tool in database
    await updateTool({
      id: validatedData.id,
      name: validatedData.name,
      avatar: validatedData.avatar,
      description: validatedData.description,
      data: data,
      typeName: validatedData.typeName,
      userId: session?.user?.id,
      createdAt: new Date(),
    } as any);

    return { status: 'success' };
  } catch (error) {
    console.error('Failed to update tool:', error);
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};