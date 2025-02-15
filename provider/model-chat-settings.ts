import type { OpenAICompatibleChatSettings } from "@ai-sdk/openai-compatible"

export type ModelChatModelId = "LeBaron" | (string & {})

export interface ModelChatSettings extends OpenAICompatibleChatSettings {
  // Add any Model-specific settings here
  system_fingerprint?: string
}

