import type { LanguageCode } from 'grammy/types';

import { eq } from 'drizzle-orm';
import { Composer } from 'grammy';

import type { CustomContext } from '@/types/CustomContext';

import { db } from '@/db/drizzle/connect';
import { users } from '@/db/drizzle/schema';
import { createBaseInfoReply } from '@/lib/create-reply';

const composer = new Composer<CustomContext>();

composer.command('start', async (ctx) => {
  ctx.session.chatId = ctx.chatId;
  ctx.session.from = ctx.from;
  ctx.session.route = 'writeInitialData';
  ctx.session.lang = ctx.from.language_code as LanguageCode;
  const time = new Date(ctx.message.date * 1000);
  ctx.session.utcOffset = time.getHours() - new Date().getUTCHours();
  await ctx.reply('Напишите вашу дату рождения в формате ДД.ММ.ГГГГ');
});

composer.command('info', async (ctx) => {
  const user = await db.select().from(users).where(eq(users.chatId, ctx.session.chatId.toString()));

  if (user.length === 0) {
    await ctx.reply('Сначала вы должны пройти опрос используя команду /start');
  }

  await ctx.reply(createBaseInfoReply(+user[0].monthsLived, +user[0].weeksLived));
});

export { composer };
