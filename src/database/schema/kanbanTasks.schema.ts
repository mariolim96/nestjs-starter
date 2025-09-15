import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { kanbanColumns } from './kanban-columns.schema';
import { users } from './users.schema';

export const kanbanTasks = pgTable('kanban_tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  columnId: integer('column_id').references(() => kanbanColumns.id),
  assignedTo: integer('assigned_to').references(() => users.id),
  priority: varchar('priority', { length: 20 }).default('medium'),
  status: varchar('status', { length: 20 }).default('todo'),
  externalTaskId: varchar('external_task_id', { length: 255 }),
  externalService: varchar('external_service', { length: 50 }),
  dueDate: timestamp('due_date'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertKanbanTaskSchema = createInsertSchema(kanbanTasks);
export const selectKanbanTaskSchema = createSelectSchema(kanbanTasks);

export type KanbanTask = typeof kanbanTasks.$inferSelect;
export type NewKanbanTask = typeof kanbanTasks.$inferInsert;
