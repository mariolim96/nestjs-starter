import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { kanbanBoards } from './kanban-boards.schema';

export const kanbanColumns = pgTable('kanban_columns', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id').references(() => kanbanBoards.id),
  name: varchar('name', { length: 100 }).notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertKanbanColumnSchema = createInsertSchema(kanbanColumns);
export const selectKanbanColumnSchema = createSelectSchema(kanbanColumns);

export type KanbanColumn = typeof kanbanColumns.$inferSelect;
export type NewKanbanColumn = typeof kanbanColumns.$inferInsert;
