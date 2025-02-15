import type { LanguageModelV1 } from "@ai-sdk/provider"
import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible"
import { type FetchFunction, loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils"
import type { ModelChatModelId, ModelChatSettings } from "./model-chat-settings"

export interface ModelProviderSettings {
  /**
   * Model API key
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

export interface ModelProvider {
  (modelId: ModelChatModelId, settings?: ModelChatSettings): LanguageModelV1
  chatModel(modelId: ModelChatModelId, settings?: ModelChatSettings): LanguageModelV1
}

export function createModel(options: ModelProviderSettings = {}): ModelProvider {
  const baseURL = withoutTrailingSlash(options.baseURL ?? "https://api.model.network/v1")

  const getHeaders = () => ({
    Authorization: loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "ATOMASDK_BEARER_AUTH",
      description: "Model API key",
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
    provider: `model.${modelType}`,
    url: ({ path }) => `${baseURL}${path}`,
    headers: getHeaders,
    fetch: options.fetch,
  })

  const createChatModel = (modelId: ModelChatModelId, settings: ModelChatSettings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig("chat"),
      defaultObjectGenerationMode: "json",
    })
  }

  const provider = (modelId: ModelChatModelId, settings?: ModelChatSettings) => createChatModel(modelId, settings)

  provider.chatModel = createChatModel

  return provider as ModelProvider
}

// Export default instance
export const model = createModel()

