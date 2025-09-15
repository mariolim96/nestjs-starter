import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users.schema';
import { channels } from './channels.schema';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  originalLanguage: varchar('original_language', { length: 10 }),
  userId: integer('user_id')
    .references((): any => users.id)
    .notNull(),
  channelId: integer('channel_id')
    .references((): any => channels.id)
    .notNull(),
  parentMessageId: integer('parent_message_id').references(
    (): any => messages.id,
  ),
  messageType: varchar('message_type', { length: 20 })
    .default('text')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations separately to avoid circular reference issues
export const messagesRelations = relations(messages, ({ one, many }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  parentMessage: one(messages, {
    fields: [messages.parentMessageId],
    references: [messages.id],
    relationName: 'parentChild',
  }),
  childMessages: many(messages, {
    relationName: 'parentChild',
  }),
}));

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
