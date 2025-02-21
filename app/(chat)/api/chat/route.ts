import {
  convertToCoreMessages,
  generateId,
  Message,
  StreamData,
  streamObject,
  streamText,
} from 'ai';
import { z, ZodObject } from 'zod';

import { customModel } from '@/ai';
import { canvasPrompt, regularPrompt } from '@/ai/prompts';
import { auth } from '@/app/(auth)/auth';
import {
  convertParamsToZod,
  createParametersSchema,
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
    agent,
    tools,
  }: {
    id: string;
    messages: Array<Message>;
    agent: any;
    tools: Tool[];
  } = await request.json();
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }


  if (!agent.providerData) {
    return new Response('Model not found', { status: 401 });
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

      item.data.methods.reduce((toolMethod: any, itemMethod: any) => {

        // get args
        let params = {};
        if (itemMethod.args) {
          params = itemMethod.args.reduce(
            (
              acc: any,
              { name, type, description, value: defaultValue }: any
            ) => {
              acc[name] = {
                type,
                description,
                defaultValue: defaultValue !== undefined ? defaultValue : '',
              };
              return acc;
            },
            {}
          );
        }

        let ParametersSchema: any = convertParamsToZod(params);

        if (item.data.chain == 'near' && itemMethod.kind == 'call') {
          ParametersSchema = {
            ...ParametersSchema,
            deposit: z
              .string()
              .describe('Amount of near to deposit by user.')
              .default('10000000000000000000000'),
          };
        }
        toolMethod[itemMethod.name + '_' + generateId()] = {
          description: itemMethod.description || '',
          parameters: z.object(ParametersSchema),
          execute: async (ParametersData: ParametersData) => {
            const url = `${process.env.NEXT_PUBLIC_METADATA_URL}/api/data`;

            if (item.data.chain == 'near' && itemMethod.kind == 'view') {
              try {
                const data = {
                  args: ParametersData,
                  network: 'mainnet',
                  method_name: itemMethod.name,
                  contract_id: item.data.contractAddress,
                  chain: 'near',
                };
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                let convertString;
                if (typeof data == 'object') {
                  convertString = JSON.stringify(result);
                } else {
                  convertString = result;
                }
                return `{result: ${convertString}}`;
              } catch (error) {
                return `Error calling contract method:${error}`;
              }
            }
            if (item.data.chain == 'near' && itemMethod.kind == 'call') {
              const { deposit, ...args } = ParametersData;
              const transaction = {
                receiverId: item.data.contractAddress,
                actions: [
                  {
                    type: 'FunctionCall',
                    params: {
                      methodName: itemMethod.name,
                      args: args,
                      gas: '30000000000000',
                      deposit: deposit,
                    },
                  },
                ],
              };
              return `{ transaction:  ${JSON.stringify(transaction)}}`;
            }

            if (item.data.chain == 'starknet' && itemMethod.kind == 'view') {
              try {
                const data = {
                  args: ParametersData,
                  network: 'mainnet',
                  method_name: itemMethod.name,
                  contract_id: item.data.contractAddress,
                  chain: 'starknet',
                };
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                let convertString;
                if (typeof data == 'object') {
                  convertString = JSON.stringify(result);
                } else {
                  convertString = result;
                }
                return `{result: ${convertString}}`;
              } catch (error) {
                return `Error calling contract method:${error}`;
              }
            }
            if (item.data.chain == 'starknet' && itemMethod.kind == 'call') {
              const transaction = {
                address: item.data.contractAddress,
                method: itemMethod.name,
                data: Object.values(ParametersData)
              };
              return `{ transaction:  ${JSON.stringify(transaction)}}`;
            }
          },
        };
        return toolMethod;
      }, tool);
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
      let params = {};
      if (item.data.args) {
        params = item.data.args.reduce(
          (acc: any, { name, type, description, defaultValue }: any) => {
            if (name === '') {
              return {};
            }
            acc[name] = { type, description, defaultValue };
            return acc;
          },
          {}
        );
      }

      // const params ={
      //   args: {
      //     type: 'any',
      //     description: 'transaction to create greeting.',
      //      defaultValue :''
      //   }
      // }

      const ParametersSchema: any = convertParamsToZod(params);
      tool['widget' + '_' + generateId()] = {
        description: item.description,
        parameters: z.object(ParametersSchema),
        execute: async (ParametersSchema: ParametersData) => {
          console.log(ParametersSchema);
          //return <TransactionFrame transaction={args}/>
          return item.data.code;
        },
      };
    }
    if (item.typeName == 'api') {
      const spec = item.data;
      for (const pathItem of spec.paths) {
        const {
          path,
          method,
          operationId,
          summary,
          description,
          requestBody,
          parameters,
        } = pathItem;
        tool[operationId] = {
          description:
            summary || description || `${method.toUpperCase()} ${path}`,
          parameters: createParametersSchema(parameters, requestBody),
          execute: async (params: any) => {
            // Parse the endpoint URL
            try {
              const endpointUrl = new URL(spec.endpoint);

              // Combine the endpoint's pathname with the path, ensuring we don't lose any parts
              let fullPath = `${endpointUrl.pathname}${path}`.replace(
                /\/+/g,
                '/'
              );
              if (!fullPath.startsWith('/')) {
                fullPath = '/' + fullPath;
              }

              // Handle path parameters
              for (const [key, value] of Object.entries(params)) {
                const param = parameters.find((p: any) => p.name === key);
                if (param && param.in === 'path') {
                  fullPath = fullPath.replace(
                    `{${key}}`,
                    encodeURIComponent(String(value))
                  );
                }
              }

              // Construct the final URL
              const url = new URL(fullPath, endpointUrl.origin);
              const queryParams = new URLSearchParams();
              const headers = new Headers();
              let body: any;

              const contentType = requestBody?.content
                ? Object.keys(requestBody.content)[0]
                : 'application/json';
              if (contentType === 'application/x-www-form-urlencoded') {
                body = new URLSearchParams();
              } else if (contentType === 'multipart/form-data') {
                body = new FormData();
              }

              for (const [key, value] of Object.entries(params) as any) {
                const param = parameters.find((p: any) => p.name === key);
                if (param) {
                  if (param.in === 'query') {
                    if (Array.isArray(value)) {
                      value.forEach((v) => queryParams.append(key, String(v)));
                    } else {
                      queryParams.append(key, String(value));
                    }
                  } else if (param.in === 'header') {
                    headers.append(key, String(value));
                  }
                } else if (key === 'body') {
                  if (contentType === 'application/octet-stream') {
                    if (value instanceof Blob) {
                      body = value;
                    } else if (typeof value === 'string') {
                      if (value.startsWith('data:')) {
                        // Handle base64 encoded data URLs
                        const res = await fetch(value);
                        body = await res.blob();
                      } else if (
                        value.startsWith('http://') ||
                        value.startsWith('https://')
                      ) {
                        // Handle image URLs
                        const res = await fetch(value);
                        const blob = await res.blob();

                        body = new FormData();
                        body.append('file', blob, 'filename.jpg');
                      } else {
                        console.log(
                          'Invalid image data. Must be a Blob, data URL, or image URL.'
                        );
                      }
                    } else {
                      console.log(
                        'Binary data must be provided as a Blob, data URL, or image URL for application/octet-stream'
                      );
                    }
                  } else if (
                    contentType === 'application/x-www-form-urlencoded'
                  ) {
                    for (const [formKey, formValue] of Object.entries(
                      value
                    ) as any) {
                      body.append(formKey, String(formValue));
                    }
                  } else if (contentType === 'multipart/form-data') {
                    for (const [formKey, formValue] of Object.entries(
                      value
                    ) as any) {
                      if ((formValue instanceof Blob) as any) {
                        body.append(formKey, formValue, formValue.name);
                      } else {
                        body.append(formKey, String(formValue));
                      }
                    }
                  } else {
                    body = JSON.stringify(value);
                  }
                }
              }

              if (queryParams.toString()) {
                url.search = queryParams.toString();
              }
              if (item.accessToken) {
                headers.append('Authorization', `Bearer ${item.apiKey}`);
              }
              headers.append('Content-Type', contentType);
              headers.append('Accept', 'application/json');
              // if (
              //   contentType === 'application/json' ||
              //   contentType === 'application/octet-stream'
              // ) {
              //   headers.append('Accept', 'application/json');
              // }

              const response = await fetch(url.toString(), {
                method: method.toUpperCase(),
                headers,
                body:
                  contentType === 'application/json'
                    ? body
                    : body instanceof Blob
                      ? body
                      : body?.toString(),
              });
              const data = await response.json();
              if (data && typeof data === 'object') {
                return JSON.stringify(data);
              } else {
                return data;
              }
            } catch (error) {
              console.error('Failed to make API request:', error, params);
              if (error && typeof error === 'object') {
                return `Failed to make API request: ${JSON.stringify(error)}`;
              } else {
                return `Failed to make API request: ${error}`;
              }
            }
          },
        };
      }
    }
    return tool;
  }, {});
  const streamingData = new StreamData();
  const result = await streamText({
    model: customModel(agent.providerData),
    system: `Your name are ${agent.name} \n\n ${agent.prompt}`, //modelId === 'gpt-4o-canvas' ? canvasPrompt : regularPrompt,
    messages: coreMessages,
    maxSteps: 10,
    experimental_toolCallStreaming: true,
    experimental_activeTools:
      agent.providerData.modelName === 'gpt-4o-canvas'
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
            model: customModel(agent.providerData),
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
            model: customModel(agent.providerData),
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
            model: customModel(agent.providerData),
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
