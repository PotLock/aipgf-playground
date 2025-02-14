import type { OpenAICompatibleChatSettings } from "@ai-sdk/openai-compatible"

export type CustomAIChatModelId = "customai/chat-model-1" | "customai/chat-model-2" | (string & {})

export interface CustomAIChatSettings extends OpenAICompatibleChatSettings {
  // Add any custom settings here
}

