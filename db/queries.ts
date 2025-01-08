'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, inArray } from 'drizzle-orm';
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
} from './schema';

// Optionally, if not using username/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(username: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.username, username));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(username: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ username, password: hash });
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
      .select()
      .from(agent)
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
    const chatIds = await db
      .select()
      .from(chat)
      .where(eq(chat.agentId, id));

    const chatIdArray = chatIds.map(chat => chat.id);

    if (chatIdArray.length > 0) {
      // Remove messenger data associated with the chat IDs
      await db
        .delete(message)
        .where(inArray(message.chatId, chatIdArray));
      console.log(`Removed messenger data for chats with agent id: ${id}`);

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
  model,
  tools,
  userId,
  prompt,
  suggestedActions,
}: Agent) {
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
        model,
        userId,
        suggestedActions,
      })
      .returning({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        tools: agent.tools,
        prompt: agent.prompt,
        avatar: agent.avatar,
        intro: agent.intro,
        model: agent.model,
        userId: agent.userId,
        createdAt: agent.createdAt,
        suggestedActions: agent.suggestedActions,
      });
  } catch (error) {
    console.error('Failed to create agent in database');
    throw error;
  }
}

export async function getAgentByUserId({ userId }: { userId: string }) {
  try {
    const agents = await db
      .select()
      .from(agent)
      .where(eq(agent.userId, userId))
      .orderBy(desc(agent.createdAt)); // Order by createdAt in descending order

    const agentWithTools = await Promise.all(
      agents.map(async (agent) => {
        let tools: Tool[] = [];
        if (Array.isArray(agent.tools) && agent.tools.length > 0) {
          tools = await db
            .select()
            .from(tool)
            .where(inArray(tool.id, agent.tools as string[]));
        }
        return {
          ...agent,
          tools,
          
        };
      })
    );
 console.log(agentWithTools);
    return agentWithTools;
  } catch (error) {
    console.log(error);
    console.error('Failed to get agents by userId from database');
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

export async function getToolByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(tool)
      .where(eq(tool.userId, userId))
      .orderBy(desc(tool.createdAt));
  } catch (error) {
    console.log(error);
    console.error('Failed to get tools by userId from database');
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

