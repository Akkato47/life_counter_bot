import type { LanguageCode } from 'grammy/types';

import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  userTelegramId: text('user_telegram_id').notNull().unique(),
  chatId: text('chat_id').notNull().unique(),
  username: text('username').notNull(),
  weeksLived: text('weeks_lived'),
  monthsLived: text('monthes_lived'),
  lang: text('lang').$type<LanguageCode>(),
  utcOffset: integer('utc_offset'),
  birthDate: timestamp('birth_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull()
});
