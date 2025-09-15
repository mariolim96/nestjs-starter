import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { messages } from './messages.schema';

export const messageTranslations = pgTable(
  'message_translations',
  {
    id: serial('id').primaryKey(),
    messageId: integer('message_id').references(() => messages.id),
    language: varchar('language', { length: 10 }).notNull(),
    translatedContent: text('translated_content').notNull(),
    translationService: varchar('translation_service', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    uniqueMessageLanguage: unique().on(table.messageId, table.language),
  }),
);

export const insertMessageTranslationSchema =
  createInsertSchema(messageTranslations);
export const selectMessageTranslationSchema =
  createSelectSchema(messageTranslations);

export type MessageTranslation = typeof messageTranslations.$inferSelect;
export type NewMessageTranslation = typeof messageTranslations.$inferInsert;
