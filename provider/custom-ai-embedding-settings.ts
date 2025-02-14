import type { OpenAICompatibleEmbeddingSettings } from "@ai-sdk/openai-compatible"

export type CustomAIEmbeddingModelId = "customai/embedding-model-1" | "customai/embedding-model-2" | (string & {})

export interface CustomAIEmbeddingSettings extends OpenAICompatibleEmbeddingSettings {
  // Add any custom settings here
}

