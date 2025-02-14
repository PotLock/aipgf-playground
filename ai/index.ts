import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { createAtoma } from '../provider'; // Assuming this is the correct import for Atoma SDK

import { customMiddleware } from './custom-middleware';

export const customModel = (provider: any) => {
  let model;

  if (provider.provider === 'atoma') {
    const atoma = createAtoma({
      baseURL: 'https://api.atoma.network/v1',
      apiKey: process.env.ATOMASDK_BEARER_AUTH,
    });
    model = atoma(provider.apiIdentifier);
  } else {
    model = openai(provider.apiIdentifier);
  }

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};