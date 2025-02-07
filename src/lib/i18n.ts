import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import path from 'node:path';

import { logger } from './loger';
async function initializeI18n() {
  await i18next.use(Backend).init({
    lng: 'ru', // Язык по умолчанию, можно изменять в зависимости от пользователя
    fallbackLng: 'en', // Язык, на который будем переводить, если перевод для пользователя не найден
    backend: {
      backendOptions: [
        {
          loadPath: path.join(__dirname, '..', 'locales', '{{lng}}.json')
        }
      ]
    },
    interpolation: {
      escapeValue: false // для предотвращения экранирования
    }
  });
}

initializeI18n()
  .then(() => {
    logger.info('i18next initialized');
  })
  .catch((err) => {
    console.error('Error initializing i18next', err);
  });

export default i18next;
