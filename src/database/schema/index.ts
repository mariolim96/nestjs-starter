export * from './users.schema';
// export * from './channels.schema';
// export * from './messages.schema';
// export * from './messageTranslation.schema';
// export * from './kanban-boards.schema';
// export * from './kanban-columns.schema';
// export * from './kanbanTasks.schema';
// export * from './externalEvents.schema';
// export * from './channelMembers.schema';

// Relations
// import { relations } from 'drizzle-orm';
// import { users } from './users.schema';
// import { channels } from './channels.schema';
// import { messages } from './messages.schema';
// import { messageTranslations } from './messageTranslation.schema';
// import { kanbanBoards } from './kanban-boards.schema';
// import { kanbanColumns } from './kanban-columns.schema';
// import { kanbanTasks } from './kanbanTasks.schema';
// import { externalEvents } from './externalEvents.schema';
// import { channelMembers } from './channelMembers.schema';

// export const usersRelations = relations(users, ({ many }) => ({
//   messages: many(messages),
//   createdChannels: many(channels),
//   createdBoards: many(kanbanBoards),
//   assignedTasks: many(kanbanTasks),
//   createdTasks: many(kanbanTasks),
//   channelMemberships: many(channelMembers),
// }));

// export const channelsRelations = relations(channels, ({ one, many }) => ({
//   creator: one(users, {
//     fields: [channels.createdBy],
//     references: [users.id],
//   }),
//   messages: many(messages),
//   kanbanBoards: many(kanbanBoards),
//   externalEvents: many(externalEvents),
//   members: many(channelMembers),
// }));

// export const messagesRelations = relations(messages, ({ one, many }) => ({
//   user: one(users, {
//     fields: [messages.userId],
//     references: [users.id],
//   }),
//   channel: one(channels, {
//     fields: [messages.channelId],
//     references: [channels.id],
//   }),
//   parentMessage: one(messages, {
//     fields: [messages.parentMessageId],
//     references: [messages.id],
//     relationName: 'parentChild',
//   }),
//   childMessages: many(messages, {
//     relationName: 'parentChild',
//   }),
// }));

// export const messageTranslationsRelations = relations(
//   messageTranslations,
//   ({ one }) => ({
//     message: one(messages, {
//       fields: [messageTranslations.messageId],
//       references: [messages.id],
//     }),
//   }),
// );

// export const kanbanBoardsRelations = relations(
//   kanbanBoards,
//   ({ one, many }) => ({
//     channel: one(channels, {
//       fields: [kanbanBoards.channelId],
//       references: [channels.id],
//     }),
//     creator: one(users, {
//       fields: [kanbanBoards.createdBy],
//       references: [users.id],
//     }),
//     columns: many(kanbanColumns),
//   }),
// );

// export const kanbanColumnsRelations = relations(
//   kanbanColumns,
//   ({ one, many }) => ({
//     board: one(kanbanBoards, {
//       fields: [kanbanColumns.boardId],
//       references: [kanbanBoards.id],
//     }),
//     tasks: many(kanbanTasks),
//   }),
// );

// export const kanbanTasksRelations = relations(kanbanTasks, ({ one }) => ({
//   column: one(kanbanColumns, {
//     fields: [kanbanTasks.columnId],
//     references: [kanbanColumns.id],
//   }),
//   assignee: one(users, {
//     fields: [kanbanTasks.assignedTo],
//     references: [users.id],
//   }),
//   creator: one(users, {
//     fields: [kanbanTasks.createdBy],
//     references: [users.id],
//   }),
// }));

// export const externalEventsRelations = relations(externalEvents, ({ one }) => ({
//   channel: one(channels, {
//     fields: [externalEvents.channelId],
//     references: [channels.id],
//   }),
// }));

// export const channelMembersRelations = relations(channelMembers, ({ one }) => ({
//   channel: one(channels, {
//     fields: [channelMembers.channelId],
//     references: [channels.id],
//   }),
//   user: one(users, {
//     fields: [channelMembers.userId],
//     references: [users.id],
//   }),
// }));
