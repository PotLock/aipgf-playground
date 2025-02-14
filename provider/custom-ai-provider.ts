import type { LanguageModelV1, EmbeddingModelV1 } from "@ai-sdk/provider"
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
} from "@ai-sdk/openai-compatible"
import { type FetchFunction, loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils"
import type { CustomAIChatModelId, CustomAIChatSettings } from "./custom-ai-chat-settings"
import type { CustomAICompletionModelId, CustomAICompletionSettings } from "./custom-ai-completion-settings"
import type { CustomAIEmbeddingModelId, CustomAIEmbeddingSettings } from "./custom-ai-embedding-settings"

export interface CustomAIProviderSettings {
  /**
   * CustomAI API key.
   */
  apiKey?: string
  /**
   * Base URL for the API calls.
   */
  baseURL?: string
  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>
  /**
   * Optional custom url query parameters to include in request urls.
   */
  queryParams?: Record<string, string>
  /**
   * Custom fetch implementation. You can use it as a middleware to intercept requests,
   * or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction
}

export interface CustomAIProvider {
  /**
   * Creates a model for text generation.
   */
  (modelId: CustomAIChatModelId, settings?: CustomAIChatSettings): LanguageModelV1
  /**
   * Creates a chat model for text generation.
   */
  chatModel(modelId: CustomAIChatModelId, settings?: CustomAIChatSettings): LanguageModelV1
  /**
   * Creates a completion model for text generation.
   */
  completionModel(modelId: CustomAICompletionModelId, settings?: CustomAICompletionSettings): LanguageModelV1
  /**
   * Creates a text embedding model for text generation.
   */
  textEmbeddingModel(modelId: CustomAIEmbeddingModelId, settings?: CustomAIEmbeddingSettings): EmbeddingModelV1<string>
}

export function createCustomAI(options: CustomAIProviderSettings = {}): CustomAIProvider {
  const baseURL = withoutTrailingSlash(options.baseURL ?? "https://api.customai.com/v1")
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "CUSTOM_AI_API_KEY",
      description: "CustomAI API key",
    })}`,
    ...options.headers,
  })

  interface CommonModelConfig {
    provider: string
    url: ({ path }: { path: string }) => string
    headers: () => Record<string, string>
    fetch?: FetchFunction
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `customai.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`)
      if (options.queryParams) {
        url.search = new URLSearchParams(options.queryParams).toString()
      }
      return url.toString()
    },
    headers: getHeaders,
    fetch: options.fetch,
  })

  const createChatModel = (modelId: CustomAIChatModelId, settings: CustomAIChatSettings = {}) => {
    return new OpenAICompatibleChatLanguageModel(modelId, settings, {
      ...getCommonModelConfig("chat"),
      defaultObjectGenerationMode: "tool",
    })
  }

  const createCompletionModel = (modelId: CustomAICompletionModelId, settings: CustomAICompletionSettings = {}) =>
    new OpenAICompatibleCompletionLanguageModel(modelId, settings, getCommonModelConfig("completion"))

  const createTextEmbeddingModel = (modelId: CustomAIEmbeddingModelId, settings: CustomAIEmbeddingSettings = {}) =>
    new OpenAICompatibleEmbeddingModel(modelId, settings, getCommonModelConfig("embedding"))

  const provider = (modelId: CustomAIChatModelId, settings?: CustomAIChatSettings) => createChatModel(modelId, settings)

  provider.completionModel = createCompletionModel
  provider.chatModel = createChatModel
  provider.textEmbeddingModel = createTextEmbeddingModel

  return provider as CustomAIProvider
}

// Export default instance
export const customAI = createCustomAI()

