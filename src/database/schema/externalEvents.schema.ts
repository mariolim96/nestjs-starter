import {
  pgTable,
  serial,
  varchar,
  jsonb,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { channels } from './channels.schema';

export const externalEvents = pgTable('external_events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  serviceName: varchar('service_name', { length: 50 }).notNull(),
  eventData: jsonb('event_data').notNull(),
  channelId: integer('channel_id').references(() => channels.id),
  processed: boolean('processed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const insertExternalEventSchema = createInsertSchema(externalEvents);
export const selectExternalEventSchema = createSelectSchema(externalEvents);

export type ExternalEvent = typeof externalEvents.$inferSelect;
export type NewExternalEvent = typeof externalEvents.$inferInsert;
