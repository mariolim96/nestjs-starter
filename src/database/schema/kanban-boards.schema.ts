import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { channels } from './channels.schema';
import { users } from './users.schema';

export const kanbanBoards = pgTable('kanban_boards', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  channelId: integer('channel_id').references(() => channels.id),
  externalBoardId: varchar('external_board_id', { length: 255 }),
  externalService: varchar('external_service', { length: 50 }),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertKanbanBoardSchema = createInsertSchema(kanbanBoards);
export const selectKanbanBoardSchema = createSelectSchema(kanbanBoards);

export type KanbanBoard = typeof kanbanBoards.$inferSelect;
export type NewKanbanBoard = typeof kanbanBoards.$inferInsert;
