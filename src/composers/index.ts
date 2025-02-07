import type { LanguageCode } from 'grammy/types';

import { Composer } from 'grammy';

import type { CustomContext } from '@/types/CustomContext';

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

export { composer };
