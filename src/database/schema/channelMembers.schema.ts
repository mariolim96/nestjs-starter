import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { channels } from './channels.schema';
import { users } from './users.schema';

export const channelMembers = pgTable(
  'channel_members',
  {
    id: serial('id').primaryKey(),
    channelId: integer('channel_id').references(() => channels.id),
    userId: integer('user_id').references(() => users.id),
    role: varchar('role', { length: 20 }).default('member'),
    joinedAt: timestamp('joined_at').defaultNow(),
  },
  (table) => ({
    uniqueChannelUser: unique().on(table.channelId, table.userId),
  }),
);

export const insertChannelMemberSchema = createInsertSchema(channelMembers);
export const selectChannelMemberSchema = createSelectSchema(channelMembers);

export type ChannelMember = typeof channelMembers.$inferSelect;
export type NewChannelMember = typeof channelMembers.$inferInsert;
