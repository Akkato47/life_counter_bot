import type { Bot } from 'grammy';

import { eq } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { users } from '@/db/drizzle/schema';

import { createWeaklyReportReply } from './create-reply';
import { logger } from './loger';

export const weeklyReminder = async (now: Date, bot: Bot) => {
  try {
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
        await bot.api.sendMessage(
          user.chatId,
          createWeaklyReportReply(newMountsLived, newWeeksLived),
          {
            parse_mode: 'Markdown'
          }
        );
      } catch (error) {
        logger.error(error);
      }
    }
  } catch (error) {
    logger.error(error);
  }
};
