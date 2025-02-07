ARG APPNAME="${APPNAME}" \
  PORT="${PORT}" \
  NODE_ENV="prod" \
  LOCALE="true" \
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
COPY scripts/install-prod.sh ./scripts/install-prod.sh
COPY package.json ./

RUN apk add --no-cache jq
# RUN sh ./scripts/install-prod.sh temporary
RUN npm install aws-sdk@^2.1691.0 axios@^1.7.7 bcrypt@^5.1.1 cookie-parser@^1.4.6 cors@^2.8.5 dotenv@^16.3.1 drizzle-orm@0.31.0 express@^4.21.2 jsonwebtoken@9.0.1 morgan@^1.10.0 multer@^1.4.5-lts.1 nodemailer@^6.9.15 nodemailer-express-handlebars@^7.0.0 pg@^8.12.0 postgres@^3.3.5 redis@^4.7.0 sharp@^0.33.5 swagger-ui-express@^5.0.1 uuid@^10.0.0 winston@^3.10.0 zod@^3.22.2
# RUN npm install $(cat package.json | jq -r '.dependencies | to_entries | .[] | "\(.key)@\(.value)"')
RUN apk del jq

ENV APPNAME="${APPNAME}" \
  PORT="${PORT}" \
  NODE_ENV="prod" \
  LOCALE="true" \
  BOT_API_KEY="${BOT_API_KEY}" \
  DATABASE_HOST="${DATABASE_HOST}" \
  DATABASE_PORT="${DATABASE_PORT}" \
  DATABASE_USER="${DATABASE_USER}" \
  DATABASE_PASSWORD="${DATABASE_PASSWORD}" \
  DATABASE_NAME="${DATABASE_NAME}" \
  DATABASE_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}" 

EXPOSE ${PORT}