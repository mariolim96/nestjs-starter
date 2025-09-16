// filepath: src/database/schema/users.schema.ts
import {
  pgTable,
  serial,
  varchar,
  //   boolean,
  //   timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  //   preferredLanguage: varchar('preferred_language', { length: 10 }).default(
  //     'en',
  //   ),
  //   isOnline: boolean('is_online').default(false),
  //   lastSeen: timestamp('last_seen').defaultNow(),
  //   createdAt: timestamp('created_at').defaultNow(),
  //   updatedAt: timestamp('updated_at').defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
