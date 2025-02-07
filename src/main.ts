import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot, session } from 'grammy';
import cron from 'node-cron';

import type { SessionData } from './types/SessionData';

import { composer } from './composers';
import config from './config';
import { logger } from './lib/loger';
import { weeklyReminder } from './lib/weekly-reminder';
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
  logger.error(err.message);
});

bot.use(writeDataRouter);

bot.use(composer);

cron.schedule('0 * * * 1', async (now) => {
  if (now instanceof Date) {
    await weeklyReminder(now, bot);
  }
});

bot.start({
  onStart(botInfo) {
    logger.info(`BOT: '${botInfo.first_name}' started`);
  }
});
