import type { OpenAICompatibleCompletionSettings } from "@ai-sdk/openai-compatible"

export type CustomAICompletionModelId = "customai/completion-model-1" | "customai/completion-model-2" | (string & {})

export interface CustomAICompletionSettings extends OpenAICompatibleCompletionSettings {
  // Add any custom settings here
}

