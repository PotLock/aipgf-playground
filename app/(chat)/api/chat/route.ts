import {
  convertToCoreMessages,
  generateId,
  Message,
  StreamData,
  streamObject,
  streamText,
} from 'ai';
import { providers } from 'near-api-js';
import { Web3 } from 'web3';
import { z, ZodObject } from 'zod';

import { customModel } from '@/ai';
import { models } from '@/ai/models';
import { canvasPrompt, regularPrompt } from '@/ai/prompts';
import { auth } from '@/app/(auth)/auth';
import {
  convertParamsToZod,
  extractParameters,
  getUrl,
  jsonSchemaToZodSchema,
} from '@/components/utils/tool.util';
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from '@/db/queries';
import { Suggestion } from '@/db/schema';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const canvasTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
];

const weatherTools: AllowedTools[] = ['getWeather'];
type ParametersData = Record<string, any>; // Define the shape of ParametersData based on your requirements

// Schema for the `tool` object entries
interface ToolEntry {
  description: string;
  parameters: ZodObject<any>; // This can be refined to match `ParametersSchema` type
  execute: (ParametersData: ParametersData) => Promise<string>;
}
type ToolKey = `${string}_${string}_${string}`;
type Tool = Record<ToolKey, ToolEntry>;
export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
    agent,
    tools,
  }: {
    id: string;
    messages: Array<Message>;
    modelId: string;
    agent: any;
    tools: Tool[];
  } = await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({
      id,
      userId: session.user.id,
      title,
      agentId: agent.id,
    });
  }

  await saveMessages({
    messages: [
      { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
    ],
  });
  // if tools = smartcontract pls create more tools by methods. smartcontract here

  const toolsData = tools.reduce((tool: any, item: any) => {
    if (item.typeName == 'smartcontract') {
      tool = item.data.methods.reduce((method: any, itemMethod: any) => {
        // get args
        let params = {};
        if (itemMethod.args) {
          params = itemMethod.args.reduce(
            (acc: any, { name, type, description }: any) => {
              acc[name] = { type, description };
              return acc;
            },
            {}
          );
        }
        const filteredObj: any = convertParamsToZod(params);
        const ParametersSchema: any = Object.fromEntries(
          Object.entries(filteredObj).filter(
            ([key, value]) => value !== undefined
          )
        );
        tool[itemMethod.name + '_' + generateId()] = {
          description: itemMethod.description || '',
          parameters: z.object(ParametersSchema),
          execute: async (ParametersData: ParametersData) => {
            if (item.data.chain == 'near' && itemMethod.kind == 'view') {
              try {
                const provider = new providers.JsonRpcProvider({
                  url: `https://rpc.${item.data.network}.near.org`,
                });
                const res: any = await provider.query({
                  request_type: 'call_function',
                  account_id: item.data.contractAddress,
                  method_name: itemMethod.name,
                  args_base64: Buffer.from(
                    JSON.stringify(ParametersData)
                  ).toString('base64'),
                  finality: 'final',
                });
                const data = JSON.parse(Buffer.from(res.result).toString());

                let convertString;
                if (typeof data == 'object') {
                  convertString = JSON.stringify(data);
                } else {
                  convertString = data;
                }
                console.log(convertString);
                return `${convertString}`;
              } catch (error) {
                return `Error calling contract method:${error}`;
              }
            }
            if (item.data.chain == 'near' && itemMethod.kind == 'call') {
              const data = {
                request_type: 'call_function',
                account_id: item.data.contractAddress,
                method_name: itemMethod.name,
                args_base64: Buffer.from(
                  JSON.stringify(ParametersData)
                ).toString('base64'),
                finality: 'final',
              };
              console.log(data);
              return `${JSON.stringify(data)}`;
            }
          },
        };
        return tool;
      });
      //console.log('toolSmartcontract', toolSmartcontract);
      // const [account] = item.name.split('::');
      // tool[tool.id] = {
      //   description: item.description,
      //   parameters: z.object(ParametersSchema),
      //   execute: async (ParametersData: ParametersData) => {
      //     if (item.chain == 'eth' && item.typeMethod == 'call') {
      //       return `ETH calliing`;
      //     }
      //     if (item.chain == 'eth' && item.typeMethod == 'view') {
      //       try {
      //         const web3 = new Web3('https://1rpc.io/eth');
      //         const response = await fetch(
      //           `https://api.etherscan.io/api?module=contract&action=getabi&address=${account}&apikey=${process.env.ETH_SCAN_API}`
      //         );
      //         const data = await response.json();
      //         const abi = JSON.parse(data.result);
      //         const contract = new web3.eth.Contract(abi, account);
      //         const result = await contract.methods[item.methods]().call();
      //         let convertString;
      //         if (typeof result == 'object') {
      //           convertString = JSON.stringify(result);
      //         } else {
      //           convertString = result;
      //         }
      //         return `data: ${convertString}`;
      //       } catch (error) {
      //         return `Error calling contract method:${error}`;
      //       }
      //     }
      //     return 'i dont userstand . pls explain';
      //   },
      // };
      // //if view return data
    }
    if (item.typeName == 'widget') {
      const filteredObj: any = item.data.args
        ? convertParamsToZod(item.data.args)
        : {};
      const ParametersSchema: any = Object.fromEntries(
        Object.entries(filteredObj).filter(
          ([key, value]) => value !== undefined
        )
      );

      tool[tool.id] = {
        description: item.description,
        parameters: z.object(ParametersSchema),
        execute: async (ParametersSchema: ParametersData) => {
          return item.data.code;
        },
      };
    }
    if (item.typeName == 'api') {
      const baseUrl = item.data.endpoint;

      for (const path of item.data.paths) {
        const spec: any = path;
        const toolDesc = spec.summary || spec.description || spec.operationId;

        let zodObj: any = {};
        if (spec.parameters) {
          let paramZodObjPath: any = {};
          for (const param of spec.parameters.filter(
            (param: any) => param.in === 'path'
          )) {
            paramZodObjPath = extractParameters(param, paramZodObjPath);
          }

          // Get parameters with in = query
          let paramZodObjQuery: any = {};
          for (const param of spec.parameters.filter(
            (param: any) => param.in === 'query'
          )) {
            console.log(param, paramZodObjQuery);
            paramZodObjQuery = extractParameters(param, paramZodObjQuery);
          }

          // Combine path and query parameters

          zodObj = {
            ...zodObj,
            PathParameters: z.object(paramZodObjPath),
            QueryParameters: z.object(paramZodObjQuery),
          };
        }

        if (spec.requestBody) {
          let content: any = {};
          if (spec.requestBody.content) {
            if (spec.requestBody.content['application/json']) {
              content = spec.requestBody.content['application/json'];
            } else if (
              spec.requestBody.content['application/x-www-form-urlencoded']
            ) {
              content =
                spec.requestBody.content['application/x-www-form-urlencoded'];
            } else if (spec.requestBody.content['multipart/form-data']) {
              content = spec.requestBody.content['multipart/form-data'];
            } else if (spec.requestBody.content['text/plain']) {
              content = spec.requestBody.content['text/plain'];
            }
          }
          const requestBodySchema = content.schema;
          if (requestBodySchema) {
            const requiredList = requestBodySchema.required || [];
            const requestBodyZodObj = jsonSchemaToZodSchema(
              requestBodySchema,
              requiredList,
              'properties'
            );
            zodObj = {
              ...zodObj,
              RequestBody: requestBodyZodObj,
            };
          } else {
            zodObj = {
              ...zodObj,
              input: z.string().describe('Query input').optional(),
            };
          }
        }

        if (!spec.parameters && !spec.requestBody) {
          zodObj = {
            input: z.string().describe('Query input').optional(),
          };
        }
        // console.log('zodObj', zodObj);

        tool['api_' + path.operationId + '_' + generateId()] = {
          description: toolDesc,
          parameters: z.object(zodObj),
          execute: async (arg: any) => {
            const headers: any = {
              Accept: 'application/json',
            };

            if (item.accessToken) {
              headers.Authorization = `Bearer ${item.accessToken}`;
            }
            const callOptions: RequestInit = {
              method: path.method,
              headers: {
                'Content-Type': 'application/json',
                ...headers,
              },
            };
            if (arg.RequestBody && path.method.toUpperCase() !== 'GET') {
              callOptions.body = JSON.stringify(arg.RequestBody);
            }
            console.log(JSON.stringify(arg));
            //Bugggggggggggggggggggggggggggggggggggggggggggggggggggg
            const completeUrl = getUrl(`${baseUrl}${path.path}`, arg);
            console.log(completeUrl);

            try {
              const response = await fetch(completeUrl, callOptions);
              const data = await response.json();
              return data;
            } catch (error) {
              console.error('Failed to make API request:', error);
              return `Failed to make API request: ${error}`;
            }
          },
        };
      }
    }
    return tool;
  }, {});
  const streamingData = new StreamData();
  // console.log(Object.keys(toolsData));
  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: `Your name are ${agent.name} \n\n ${agent.prompt}`, //modelId === 'gpt-4o-canvas' ? canvasPrompt : regularPrompt,
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools:
      modelId === 'gpt-4o-canvas'
        ? canvasTools
        : (Object.keys(toolsData) as any),
    tools: {
      ...toolsData,
      createDocument: {
        description: 'Create a document for a writing activity',
        parameters: z.object({
          title: z.string(),
        }),
        execute: async ({ title }: any) => {
          const id = generateUUID();
          let draftText: string = '';

          streamingData.append({
            type: 'id',
            content: id,
          });

          streamingData.append({
            type: 'title',
            content: title,
          });

          streamingData.append({
            type: 'clear',
            content: '',
          });

          const { fullStream } = await streamText({
            model: customModel(model.apiIdentifier),
            system:
              'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
            prompt: title,
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === 'text-delta') {
              const { textDelta } = delta;

              draftText += textDelta;
              streamingData.append({
                type: 'text-delta',
                content: textDelta,
              });
            }
          }

          streamingData.append({ type: 'finish', content: '' });

          if (session.user && session.user.id) {
            await saveDocument({
              id,
              title,
              content: draftText,
              userId: session.user.id,
            });
          }

          return {
            id,
            title,
            content: `A document was created and is now visible to the user.`,
          };
        },
      },
      updateDocument: {
        description: 'Update a document with the given description',
        parameters: z.object({
          id: z.string().describe('The ID of the document to update'),
          description: z
            .string()
            .describe('The description of changes that need to be made'),
        }),
        execute: async ({ id, description }: any) => {
          const document = await getDocumentById({ id });

          if (!document) {
            return {
              error: 'Document not found',
            };
          }

          const { content: currentContent } = document;
          let draftText: string = '';

          streamingData.append({
            type: 'clear',
            content: document.title,
          });

          const { fullStream } = await streamText({
            model: customModel(model.apiIdentifier),
            system:
              'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
            experimental_providerMetadata: {
              openai: {
                prediction: {
                  type: 'content',
                  content: currentContent,
                },
              },
            },
            messages: [
              {
                role: 'user',
                content: description,
              },
              { role: 'user', content: currentContent },
            ],
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === 'text-delta') {
              const { textDelta } = delta;

              draftText += textDelta;
              streamingData.append({
                type: 'text-delta',
                content: textDelta,
              });
            }
          }

          streamingData.append({ type: 'finish', content: '' });

          if (session.user && session.user.id) {
            await saveDocument({
              id,
              title: document.title,
              content: draftText,
              userId: session.user.id,
            });
          }

          return {
            id,
            title: document.title,
            content: 'The document has been updated successfully.',
          };
        },
      },
      requestSuggestions: {
        description: 'Request suggestions for a document',
        parameters: z.object({
          documentId: z
            .string()
            .describe('The ID of the document to request edits'),
        }),
        execute: async ({ documentId }: any) => {
          const document = await getDocumentById({ id: documentId });

          if (!document || !document.content) {
            return {
              error: 'Document not found',
            };
          }

          let suggestions: Array<
            Omit<Suggestion, 'userId' | 'createdAt' | 'documentCreatedAt'>
          > = [];

          const { elementStream } = await streamObject({
            model: customModel(model.apiIdentifier),
            system:
              'You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.',
            prompt: document.content,
            output: 'array',
            schema: z.object({
              originalSentence: z.string().describe('The original sentence'),
              suggestedSentence: z.string().describe('The suggested sentence'),
              description: z
                .string()
                .describe('The description of the suggestion'),
            }),
          });

          for await (const element of elementStream) {
            const suggestion = {
              originalText: element.originalSentence,
              suggestedText: element.suggestedSentence,
              description: element.description,
              id: generateUUID(),
              documentId: documentId,
              isResolved: false,
            };

            streamingData.append({
              type: 'suggestion',
              content: suggestion,
            });

            suggestions.push(suggestion);
          }

          if (session.user && session.user.id) {
            const userId = session.user.id;

            await saveSuggestions({
              suggestions: suggestions.map((suggestion) => ({
                ...suggestion,
                userId,
                createdAt: new Date(),
                documentCreatedAt: document.createdAt,
              })),
            });
          }

          return {
            id: documentId,
            title: document.title,
            message: 'Suggestions have been added to the document',
          };
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);

          await saveMessages({
            messages: responseMessagesWithoutIncompleteToolCalls.map(
              (message) => {
                const messageId = generateUUID();

                if (message.role === 'assistant') {
                  streamingData.appendMessageAnnotation({
                    messageIdFromServer: messageId,
                  });
                }

                return {
                  id: messageId,
                  chatId: id,
                  role: message.role,
                  content: message.content,
                  createdAt: new Date(),
                };
              }
            ),
          });
        } catch (error) {
          console.error('Failed to save chat');
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
