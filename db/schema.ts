import { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  agentId: uuid('agentId')
    .notNull()
    .references(() => agent.id),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id, { onDelete: 'cascade' }),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const Suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof Suggestion>;

export const tool = pgTable('Tool', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  avatar: text('avatar'),
  name: text('name').notNull(),
  typeName: varchar('typeName', { length: 64 }).notNull(),
  visible: boolean('visible').notNull().default(false),
  description: text('description'),
  //Tool Contract
  // args: json('args'),
  // typeMethod: varchar('typeMethod', { length: 64 }),
  // methods: varchar('methods', { length: 256 }),
  // network: varchar('network', { length: 64 }),
  // chain: varchar('chain', { length: 64 }),
  // // Tool API
  // accessToken: text('accessToken'),
  // spec: json('spec'),
  // // Tool Widget
  // code: text('code'),
  // args :  json('args') 
  // toolWidget: json('toolWidget') ?  tool for widget
  data: json('toolWidget'),
  //UserId
  userId: uuid('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});
export type Tool = InferSelectModel<typeof tool>;

export const agent = pgTable('Agent', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  name: varchar('name', { length: 64 }).notNull(),
  model: varchar('model', { length: 64 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  avatar: text('avatar'),
  intro: varchar('intro', { length: 256 }),
  prompt: text('prompt').notNull(),
  tools: json('tools'),
  privateKey: json('tools'),
  suggestedActions: json('suggestedActions'),
  visible: boolean('visible').notNull().default(false),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Agent = InferSelectModel<typeof agent>;
