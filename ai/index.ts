import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { createModel } from '../provider'; // Assuming this is the correct import for Atoma SDK
import { customMiddleware } from './custom-middleware';

export const customModel = (provider: any) => {
  let model;
  console.log('provider1', provider);
  if (provider.apiIdentifier === 'gpt-4o-mini' || provider.apiIdentifier === 'gpt-4o') {
    model = openai(provider.apiIdentifier);
  } else {
    const customModel = createModel({
      baseURL: provider.apiIdentifier,
      apiKey: provider.apiKey,
    });
    model = customModel(provider.modelName);
  }

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};