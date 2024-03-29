FROM node:lts-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json .
RUN npm i

# ---

FROM node:lts-alpine AS builder

WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ---

FROM node:lts-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next/standalone .
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/static ./.next/static

ENV NODE_ENV=production

ENTRYPOINT ["node", "server.js"]
