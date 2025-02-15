'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, count, desc, eq, gt, inArray, like } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';

import {
  user,
  chat,
  User,
  document,
  Suggestion,
  Message,
  message,
  vote,
  agent,
  Agent,
  Tool,
  tool,
  provider,
  Provider
} from './schema';

// Optionally, if not using username/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(process.env.POSTGRES_URL!);
let db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  agentId,
  title,
}: {
  id: string;
  userId: string;
  agentId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      agentId,
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}
export async function getAgentById(id: string) {
  try {
    const [selectedAgent] = await db
      .select({
        id: agent.id,
        avatar: agent.avatar,
        name: agent.name,
        description: agent.description,
        prompt: agent.prompt,
        intro: agent.intro,
        provider: agent.provider,
        providerData: provider,
        tools: agent.tools,
        privateKey: agent.privateKey,
        suggestedActions: agent.suggestedActions,
        createdAt: agent.createdAt,
        visible: agent.visible,
        userId: agent.userId,
      })
      .from(agent)
      .leftJoin(provider, eq(agent.provider, provider.id))
      .where(eq(agent.id, id));

    return selectedAgent;
  } catch (error) {
    console.log(error);
    console.error('Failed to get Agent from database');
    throw error;
  }
}
export async function removeAgentById(id: string) {
  try {
    const [selectedAgent] = await db
      .select()
      .from(agent)
      .where(eq(agent.id, id));

    if (!selectedAgent) {
      throw new Error('Agent not found');
    }

    // Fetch chat IDs associated with the agent
    // ...existing code...

    // Fetch chat IDs associated with the agent
    const chatIds = await db
      .select()
      .from(chat)
      .where(eq(chat.agentId, id));

    const chatIdArray = chatIds.map(chat => chat.id);

    if (chatIdArray.length > 0) {
      // Fetch message IDs associated with the chat IDs
      const messageIds = await db
        .select()
        .from(message)
        .where(inArray(message.chatId, chatIdArray));

      const messageIdArray = messageIds.map(message => message.id);

      if (messageIdArray.length > 0) {
        // Remove votes associated with the message IDs
        await db
          .delete(vote)
          .where(inArray(vote.messageId, messageIdArray));
        console.log(`Removed votes for messages with chat ids: ${chatIdArray}`);

        // Remove messenger data associated with the chat IDs
        await db
          .delete(message)
          .where(inArray(message.chatId, chatIdArray));
        console.log(`Removed messenger data for chats with agent id: ${id}`);
      }

      // Remove chats associated with the agent
      await db
        .delete(chat)
        .where(eq(chat.agentId, id));
      console.log(`Removed chats for agent with id: ${id}`);
    }

    // Remove the agent
    await db
      .delete(agent)
      .where(eq(agent.id, id));
    console.log(`Removed agent with id: ${id}`);

    return selectedAgent;
  } catch (error) {
    console.log(error);
    console.error('Failed to remove Agent from database');
    throw error;
  }
}


export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' ? true : false })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    } else {
      return await db.insert(vote).values({
        chatId,
        messageId,
        isUpvoted: type === 'up' ? true : false,
      });
    }
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database');
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  content,
  userId,
}: {
  id: string;
  title: string;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database'
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(Suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(Suggestion)
      .where(and(eq(Suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database'
    );
    throw error;
  }
}

export async function createAgent({
  name,
  description,
  avatar,
  intro,
  provider,
  tools,
  userId,
  prompt,
  suggestedActions,
  privateKey,
}: Agent) {
  console.log('createAgent', tools);
  try {
    return await db
      .insert(agent)
      .values({
        name,
        description,
        tools,
        prompt,
        avatar,
        intro,
        provider,
        userId,
        visible: false,
        suggestedActions,
        privateKey
      })
      .returning({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        tools: agent.tools,
        prompt: agent.prompt,
        avatar: agent.avatar,
        intro: agent.intro,
        model: agent.provider,
        userId: agent.userId,
        createdAt: agent.createdAt,
        visibility: agent.visible,
        suggestedActions: agent.suggestedActions,
        privateKey: agent.privateKey
      });
  } catch (error) {
    console.error('Failed to create agent in database');
    throw error;
  }
}

export async function updateAgent({
  id,
  name,
  description,
  avatar,
  intro,
  provider,
  tools,
  prompt,
  suggestedActions,
}: Agent) {
  try {
    return await db
      .update(agent)
      .set({
        name,
        description,
        tools,
        prompt,
        avatar,
        intro,
        provider,
        suggestedActions,
      })
      .where(eq(agent.id, id))
      .returning({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        tools: agent.tools,
        prompt: agent.prompt,
        avatar: agent.avatar,
        intro: agent.intro,
        model: agent.provider,
        userId: agent.userId,
        createdAt: agent.createdAt,
        suggestedActions: agent.suggestedActions,
      });
  } catch (error) {
    console.error('Failed to update agent in database', error);
    throw error;
  }
}

export async function getAgentByUserId({ userId, page = 1, limit = 10, query = '' }: { userId: string, page?: number, limit?: number, query?: string }) {
  try {
    const offset = (page - 1) * limit;

    const agents = await db
      .select()
      .from(agent)
      .where(and(eq(agent.userId, userId), like(agent.name, `%${query}%`)))
      .orderBy(desc(agent.createdAt))
      .limit(limit)
      .offset(offset); // Add pagination

    const agentWithTools = await Promise.all(
      agents.map(async (agent) => {
        let tools: Tool[] = [];
        if (Array.isArray(agent.tools) && agent.tools.length > 0) {
          tools = await db
            .select()
            .from(tool)
            .where(inArray(tool.id, agent.tools as string[]));
        }
        return { ...agent, tools };
      })
    );
    const totalAgents = await db
      .select({ count: count() })
      .from(agent)
      .where(and(eq(agent.userId, userId), like(agent.name, `%${query}%`)))
    return { agents: agentWithTools, totalAgents: totalAgents[0].count };
  } catch (error) {
    console.error('Failed to get agents by user ID', error);
    throw error;
  }
}



export async function createTool({
  name,
  avatar,
  description,
  userId,
  data,
  typeName,
}: Tool) {
  try {
    return await db
      .insert(tool)
      .values({
        name,
        avatar,
        description,
        data,
        typeName,
        userId,
      })
      .returning({
        id: tool.id,
        avatar: tool.avatar,
        name: tool.name,
        description: tool.description,
        visibility: tool.visible,
        data: tool.data,
        userId: tool.userId,
        createdAt: tool.createdAt,
      });
  } catch (error) {
    console.log(error);
    console.error('Failed to create tool in database');
    throw error;
  }
}

export async function getToolByUserId({ userId, page = 1, limit = 10, query = '' }: { userId: string, page?: number, limit?: number, query?: string }) {
  try {
    const offset = (page - 1) * limit;

    const tools = await db
      .select()
      .from(tool)
      .where(and(eq(tool.userId, userId), like(tool.name, `%${query}%`)))
      .orderBy(desc(tool.createdAt))
      .limit(limit)
      .offset(offset);

    const totalTools = await db
      .select({ count: count() })
      .from(tool)
      .where(and(eq(tool.userId, userId), like(tool.name, `%${query}%`)));
    return {
      tools,
      totalTools: totalTools[0].count,
    };
  } catch (error) {
    console.log(error);
    console.error('Failed to get tools by user ID');
    throw error;
  }
}
export async function getToolById(id: string) {
  try {
    const [selectedTool] = await db
      .select()
      .from(tool)
      .where(eq(tool.id, id));
    return selectedTool;
  } catch (error) {
    console.log(error);
    console.error('Failed to get Tool from database');
    throw error;
  }
}
export async function getToolsByIds(ids: any[]): Promise<Array<Tool>> {
  try {
    return await db.select().from(tool).where(inArray(tool.id, ids));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function updateTool({
  id,
  name,
  description,
  avatar,
  data,
  typeName,
}: Tool) {
  try {
    return await db
      .update(tool)
      .set({
        name,
        description,
        avatar,
        data,
        typeName
      })
      .where(eq(tool.id, id))
      .returning({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        avatar: tool.avatar,
        data: tool.data,
        userId: tool.userId,
        createdAt: tool.createdAt,
        typeName: tool.typeName,
      });
  } catch (error) {
    console.error('Failed to update tool in database', error);
    throw error;
  }
}

export async function removeToolById(id: string) {
  try {
    const [selectedTool] = await db
      .select()
      .from(tool)
      .where(eq(tool.id, id));

    if (!selectedTool) {
      throw new Error('tool not found');
    }
    await db
      .delete(tool)
      .where(eq(tool.id, id));
  }
  catch (error) {
    console.log(error);
    console.error('Failed to remove Tool from database');
    throw error;
  }
}
export async function changeToolVisibility(id: string, visibility: boolean) {
  try {
    const [selectedTool] = await db
      .select()
      .from(tool)
      .where(eq(tool.id, id));

    if (!selectedTool) {
      throw new Error('Tool not found');
    }

    await db
      .update(tool)
      .set({ visible: visibility })
      .where(eq(tool.id, id));
  } catch (error) {
    console.log(error);
    console.error('Failed to change tool visibility');
    throw error;
  }
}

export async function changeAgentVisibility(id: string, visibility: boolean) {
  try {
    const [selectedAgent] = await db
      .select()
      .from(agent)
      .where(eq(agent.id, id));

    if (!selectedAgent) {
      throw new Error('Agent not found');
    }

    await db
      .update(agent)
      .set({ visible: visibility })
      .where(eq(agent.id, id));
  } catch (error) {
    console.log(error);
    console.error('Failed to change agent visibility');
    throw error;
  }
}
export async function getVisibleTools({ page = 1, limit = 10, query = '' }: { page: number, limit: number, query?: string }) {
  try {
    const offset = (page - 1) * limit;
    const [tools, totalTools] = await Promise.all([
      db
        .select()
        .from(tool)
        .where(and(eq(tool.visible, true), like(tool.name, `%${query}%`)))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(tool)
        .where(and(eq(tool.visible, true), like(tool.name, `%${query}%`)))

    ]);

    return { tools, totalTools: totalTools[0].count };
  } catch (error) {
    console.log(error);
    console.error('Failed to get visible tools');
    throw error;
  }
}

export async function getVisibleAgents({ page = 1, limit = 10, query = '' }: { page: number, limit: number, query?: string }) {
  try {
    const offset = (page - 1) * limit;
    const [agents, totalAgents] = await Promise.all([
      db
        .select()
        .from(agent)
        .where(and(eq(agent.visible, true), like(agent.name, `%${query}%`)))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(agent)
        .where(and(eq(agent.visible, true), like(agent.name, `%${query}%`)))
    ]);

    return { agents, totalAgents: totalAgents[0].count };
  } catch (error) {
    console.log(error);
    console.error('Failed to get visible agents');
    throw error;
  }
}

export async function createProvider({
  userId,
  modelName,
  apiIdentifier,
  apiToken,
}: {
  userId: string;
  modelName: string;
  apiIdentifier: string;
  apiToken: string;
}) {
  await db.insert(provider).values({
    userId,
    modelName,
    apiIdentifier,
    apiToken,
  });
}


export async function getModelsByUserId({ userId, page = 1, limit = 10, query = '' }: { userId: string, page?: number, limit?: number, query?: string }) {
  try {
    const offset = (page - 1) * limit;

    const models = await db
      .select()
      .from(provider)
      .where(and(eq(provider.userId, userId), like(provider.modelName, `%${query}%`)))
      .limit(limit)
      .offset(offset); // Add pagination

    const totalModels = await db
      .select({ count: count() })
      .from(provider)
      .where(and(eq(provider.userId, userId), like(provider.modelName, `%${query}%`)));

    return { models, totalModels: totalModels[0].count };
  } catch (error) {
    console.error('Failed to get models by user ID', error);
    throw error;
  }
}
export async function updateModel({
  id,
  modelName,
  apiIdentifier,
  apiToken,
}: Provider) {
  try {
    return await db
      .update(provider)
      .set({
        modelName,
        apiIdentifier,
        apiToken,
      })
      .where(eq(provider.id, id))
      .returning({
        id: provider.id,
        modelName: provider.modelName,
        endpoint: provider.apiIdentifier,
        apiToken: provider.apiToken,
        userId: provider.userId,
      });
  } catch (error) {
    console.error('Failed to update model in database', error);
    throw error;
  }
}
export async function getModelById(id: string) {
  try {

    const [modelData] = await db
      .select()
      .from(provider)
      .where(eq(provider.id, id))

    return modelData; // Return the first element of the array
  } catch (error) {
    console.error('Failed to get model by ID', error);
    throw error;
  }
}
export async function removeModelById(id: string) {
  try {
    const [selectedProvider] = await db
      .select()
      .from(provider)
      .where(eq(provider.id, id));

    if (!selectedProvider) {
      throw new Error('tool not found');
    }
    await db
      .delete(provider)
      .where(eq(provider.id, id));
  }
  catch (error) {
    console.log(error);
    console.error('Failed to remove Tool from database');
    throw error;
  }
}