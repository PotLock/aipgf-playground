'use server';

import { CoreMessage, CoreUserMessage, generateText } from 'ai';
import { cookies } from 'next/headers';

import { customModel } from '@/ai';

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('model-id', model);
}


export async function generateTitleFromUserMessage({
  message,
}: {
  message: CoreUserMessage;
}) {

  const provider = {
    id: 'ae5e2dd9-fc5b-4a50-82d3-6cf17181e76e',
    modelName: 'GPT 3.5 turbo',
    apiIdentifier: 'gpt-3.5-turbo',
    description: 'Small model for fast, lightweight tasks',
  }
  const { text: title } = await generateText({
    model: customModel(provider),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}
