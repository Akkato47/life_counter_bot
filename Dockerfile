ARG NODE_ENV="${NODE_ENV}" \
  LOCALE="${LOCALE}" \
  BOT_API_KEY="${BOT_API_KEY}" \
  DATABASE_HOST="${DATABASE_HOST}" \
  DATABASE_PORT="${DATABASE_PORT}" \
  DATABASE_USER="${DATABASE_USER}" \
  DATABASE_PASSWORD="${DATABASE_PASSWORD}" \
  DATABASE_NAME="${DATABASE_NAME}" \
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}" 

FROM node:20.11-alpine AS builder

WORKDIR /var/www

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:20.11-alpine AS production

WORKDIR /var/www

COPY --from=builder /var/www/dist ./dist
COPY --from=builder /var/www/src/db/drizzle/migrations ./dist/db/drizzle/migrations
COPY --from=builder /var/www/src/db/drizzle/migrations/meta ./dist/db/drizzle/migrations/meta
COPY --from=builder /var/www/package-lock.json .
COPY package.json ./

RUN npm install @grammyjs/router@^2.0.0 @grammyjs/transformer-throttler@1.2.1 dotenv@^16.4.7 drizzle-orm@0.31.0 grammy@^1.34.1 node-cron@^3.0.3 pg@8.12.0 postgres@3.3.5 winston@^3.17.0 zod@^3.24.1 

ENV NODE_ENV="${NODE_ENV}" \
  LOCALE="${LOCALE}" \
  BOT_API_KEY="${BOT_API_KEY}" \
  DATABASE_HOST="${DATABASE_HOST}" \
  DATABASE_PORT="${DATABASE_PORT}" \
  DATABASE_USER="${DATABASE_USER}" \
  DATABASE_PASSWORD="${DATABASE_PASSWORD}" \
  DATABASE_NAME="${DATABASE_NAME}" \
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}" 

CMD [ "npm", "run", "start" ]