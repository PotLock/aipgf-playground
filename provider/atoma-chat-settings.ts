import type { OpenAICompatibleChatSettings } from "@ai-sdk/openai-compatible"

export type AtomaChatModelId = "LeBaron" | (string & {})

export interface AtomaChatSettings extends OpenAICompatibleChatSettings {
  // Add any Atoma-specific settings here
  system_fingerprint?: string
}

