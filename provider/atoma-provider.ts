import type { LanguageModelV1 } from "@ai-sdk/provider"
import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible"
import { type FetchFunction, loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils"
import type { AtomaChatModelId, AtomaChatSettings } from "./atoma-chat-settings"

export interface AtomaProviderSettings {
  /**
   * Atoma API key
   */
  apiKey?: string
  /**
   * Base URL for the API calls
   */
  baseURL?: string
  /**
   * Custom headers to include in the requests
   */
  headers?: Record<string, string>
  /**
   * Custom fetch implementation
   */
  fetch?: FetchFunction
}

export interface AtomaProvider {
  (modelId: AtomaChatModelId, settings?: AtomaChatSettings): LanguageModelV1
  chatModel(modelId: AtomaChatModelId, settings?: AtomaChatSettings): LanguageModelV1
}

export function createAtoma(options: AtomaProviderSettings = {}): AtomaProvider {
  const baseURL = withoutTrailingSlash(options.baseURL ?? "https://api.atoma.network/v1")

  const getHeaders = () => ({
    Authorization: loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "ATOMASDK_BEARER_AUTH",
      description: "Atoma API key",
    }),
    ...options.headers,
  })

  interface CommonModelConfig {
    provider: string
    url: ({ path }: { path: string }) => string
    headers: () => Record<string, string>
    fetch?: FetchFunction
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `atoma.${modelType}`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch,
  })

  const createChatModel = (modelId: AtomaChatModelId, settings: AtomaChatSettings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig("chat"),
      defaultObjectGenerationMode: "json",
    })
  }

  const provider = (modelId: AtomaChatModelId, settings?: AtomaChatSettings) => createChatModel(modelId, settings)

  provider.chatModel = createChatModel

  return provider as AtomaProvider
}

// Export default instance
export const atoma = createAtoma()

