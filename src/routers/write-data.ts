import { Router } from '@grammyjs/router';
import { eq, or } from 'drizzle-orm';

import type { CustomContext } from '@/types/CustomContext';

import { db } from '@/db/drizzle/connect';
import { users } from '@/db/drizzle/schema';
import { createReply } from '@/lib/create-reply';

const router = new Router<CustomContext>((ctx) => ctx.session.route);

router.route('writeInitialData', async (ctx) => {
  const birthDateStr = ctx.msg?.text;

  if (!birthDateStr) {
    return ctx.reply('Введите дату рождения в формате ДД.ММ.ГГГГ');
  }

  const [day, month, year] = birthDateStr.split('.').map(Number);
  const birthDate = new Date(year, month - 1, day);

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return ctx.reply('Некорректная дата. Введите дату в формате ДД.ММ.ГГГГ.');
  }

  const now = new Date();
  // Усредненный расчет недель (каждый понедельник +1 неделя)
  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(totalDays / 7);

  // Средний расчет месяцев (30.44 дня = 1 месяц)
  const monthsPassed = Math.floor(totalDays / 30.44);

  const tryUser = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.chatId, ctx.session.chatId.toString()),
        eq(users.userTelegramId, ctx.session.from.id.toString())
      )
    );

  if (tryUser.length > 0) {
    await db
      .delete(users)
      .where(
        or(
          eq(users.chatId, ctx.session.chatId.toString()),
          eq(users.userTelegramId, ctx.session.from.id.toString())
        )
      );
  }

  await db
    .insert(users)
    .values({
      userTelegramId: ctx.session.from.id.toString(),
      birthDate,
      chatId: ctx.session.chatId.toString(),
      username: ctx.session.from.username,
      weeksLived: weeksPassed.toString(),
      monthsLived: monthsPassed.toString(),
      utcOffset: ctx.session.utcOffset,
      lang: ctx.session.lang
    })
    .returning();

  ctx.session.route = 'waiting';

  await ctx.reply(createReply(monthsPassed, weeksPassed), { parse_mode: 'Markdown' });
});

export { router };
