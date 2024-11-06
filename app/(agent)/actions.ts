'use server';

import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { createAgent } from '@/db/queries';

const session = await auth();

const createAgentFormSchema = z.object({
  name: z.string().min(4),
  avatar: z.string().min(4),
  description: z.string().min(6),
  intro: z.string().min(6),
  model: z.string().min(6),
  prompt: z.string().min(6),
  tool: z.string().array(),
});

export interface CreateAgentActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'agent_exists'
    | 'invalid_data';
}
export const createAgentAction = async (
  _: CreateAgentActionState,
  formData: FormData
): Promise<CreateAgentActionState> => {
  try {
    const validatedData = createAgentFormSchema.parse({
      avatar: formData.get('avatar'),
      name: formData.get('name'),
      description: formData.get('description'),
      intro: formData.get('intro'),
      model: formData.get('model'),
      prompt: formData.get('prompt'),
      tool: formData.get('tool'),
    });
    await createAgent({
      name: validatedData.name,
      avatar: validatedData.avatar,
      description: validatedData.description,
      intro: validatedData.intro,
      model: validatedData.model,
      prompt: validatedData.prompt,
      createdAt: new Date(),
      tool: validatedData.tool,
      userId: session?.user?.id,
    } as any);

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
