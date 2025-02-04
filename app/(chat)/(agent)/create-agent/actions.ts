'use server';

import { put } from '@vercel/blob';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { createAgent } from '@/db/queries';
import { createImplicitAccount } from '../../(relay)/near/near-sdk';

const createAgentFormSchema = z.object({
  name: z.string().min(4),
  avatar: z.any(),
  description: z.string().min(4),
  intro: z.string(),
  model: z.string().min(4),
  prompt: z.string().min(4),
  tools: z.string(),
  suggestedActions: z.string(),
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
    const session = await auth();
    let avatarUrl: string | undefined;
    const imageFile = formData.get('avatar') as File | null;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(imageFile.name, imageFile, {
        access: 'public',
      });
      avatarUrl = blob.url;
    }
    const validatedData = createAgentFormSchema.parse({
      avatar: avatarUrl,
      name: formData.get('name'),
      description: formData.get('description'),
      intro: formData.get('intro'),
      model: formData.get('model'),
      prompt: formData.get('prompt'),
      tools: formData.get('tools') || '[]',
      suggestedActions: formData.get('suggestedActions') || '[]',
    });
    const tools = JSON.parse(validatedData.tools);
    const suggestedActions = JSON.parse(validatedData.suggestedActions);

    const { seedPhrase, publicKey, secretKey } = await createImplicitAccount();
    const privateKey = { nearAccount: { seedPhrase, publicKey, secretKey } };
    await createAgent({
      name: validatedData.name,
      avatar: validatedData.avatar,
      description: validatedData.description,
      intro: validatedData.intro,
      model: validatedData.model,
      prompt: validatedData.prompt,
      createdAt: new Date(),
      tools: tools,
      suggestedActions: suggestedActions,
      userId: session?.user?.id,
      privateKey:privateKey,
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
