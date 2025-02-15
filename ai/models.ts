// Define your models here.

export interface Model {
  id: string;
  modelName: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'ae5e2dd9-fc5b-4a50-82d3-6cf17181e76c',
    modelName: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'ae5e2dd9-fc5b-4a50-82d3-6cf17181e76d',
    modelName: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
  }
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';