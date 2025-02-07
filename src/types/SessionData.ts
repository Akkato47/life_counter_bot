import { LanguageCode, User } from 'grammy/types';

interface SessionData {
  route: string;
  from: User;
  chatId: number;
  utcOffset: number;
  lang: LanguageCode;
}

export { SessionData };
