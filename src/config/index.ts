import { env } from './env';

const isProduction = env.NODE_ENV === 'prod';
const isLocale = env.LOCALE === 'true';

export default {
  app: {
    name: env.APPNAME,
    isProduction,
    isLocale,
    port: env.PORT || 50050,
    botApiKey: env.BOT_API_KEY
  },
  database: {
    postgres: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      url: env.DATABASE_URL
    }
  }
} as const;
