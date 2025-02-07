import { apiThrottler } from '@grammyjs/transformer-throttler';
import { eq } from 'drizzle-orm';
import { Bot, session } from 'grammy';
import cron from 'node-cron';

import type { SessionData } from './types/SessionData';

import { composer } from './composers';
import config from './config';
import { db } from './db/drizzle/connect';
import { users } from './db/drizzle/schema';
import { createReply } from './lib/create-reply';
import { logger } from './lib/loger';
import { router as writeDataRouter } from './routers/write-data';

export const APROXIMATE_WEEKS_IN_LIVE = 4696;
export const APROXIMATE_MOUNTHS_IN_LIVE = 1080;

const bot = new Bot(config.app.botApiKey);

bot.api.config.use(apiThrottler());

bot.use(
  session({
    initial: (): SessionData => ({
      chatId: null,
      from: null,
      route: '',
      utcOffset: 0,
      lang: 'ru'
    })
  })
);

bot.catch((err) => {
  console.error(err);
  logger.error(err.message);
});

bot.use(writeDataRouter);

bot.use(composer);

cron.schedule('* * * * *', async (now) => {
  const date = new Date(now);

  const offset = 5;

  const usersToRemind = await db.select().from(users).where(eq(users.utcOffset, offset));

  for (const user of usersToRemind) {
    try {
      const newWeeksLived = +user.weeksLived + 1;
      let newMountsLived = +user.monthsLived;
      if (user.updatedAt.getUTCMonth !== date.getUTCMonth) {
        newMountsLived += 1;
      }
      await db
        .update(users)
        .set({ monthsLived: newMountsLived.toString(), weeksLived: newWeeksLived.toString() })
        .where(eq(users.id, user.id));
      await bot.api.sendMessage(user.chatId, createReply(newMountsLived, newWeeksLived), {
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error(error);
    }
  }
});

// i18next.init(() => logger.info('init'));

bot.start({
  onStart(botInfo) {
    logger.info(`${botInfo.first_name} started`);
  }
});
