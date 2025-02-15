import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { createModel } from '../provider'; // Assuming this is the correct import for Atoma SDK
import { models as defaultModels } from './models'; // Import default models

import { customMiddleware } from './custom-middleware';

export const customModel = (provider: any) => {
  let model;
  const isDefaultModel = defaultModels.some((defaultModel) => defaultModel.apiIdentifier === provider.apiIdentifier);
  if (isDefaultModel) {
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