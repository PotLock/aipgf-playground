import { Message } from 'ai';
import { sql, InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  username: varchar('username', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  messages: json('messages').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  agentId: uuid('agentId')
    .notNull()
    .references(() => agent.id),
});

export const tool = pgTable('Tool', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  name: text('name').notNull(),
  typeName: varchar('typeName', { length: 64 }).notNull(),
  description: text('description'),
  //Tool Contract
  args: json('args'),
  typeMethod: varchar('typeMethod', { length: 64 }),
  methods: varchar('methods', { length: 256 }),
  // Tool API SPEC
  accessToken: text('accessToken'),
  spec: json('spec'),
  network: varchar('network', { length: 64 }),
  chain: varchar('chain', { length: 64 }),
  //UserId
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});
export type Tool = InferSelectModel<typeof tool>;

export const agent = pgTable('Agent', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  name: varchar('name', { length: 64 }).notNull(),
  description: varchar('description', { length: 256 }).notNull(),
  avatar: varchar('avatar', { length: 256 }).notNull(),
  intro: varchar('intro', { length: 256 }),
  prompt: text('prompt').notNull(),
  suggestedActions: json('suggestedActions'),
  tool: json('tool'),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
});

export type Agent = InferSelectModel<typeof agent>;

export type Chat = Omit<InferSelectModel<typeof chat>, 'messages'> & {
  messages: Array<Message>;
};

