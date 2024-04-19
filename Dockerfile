FROM oven/bun:1 AS deps
WORKDIR /usr/src/app

COPY package*.json .
RUN bun i

# ---

FROM oven/bun:latest AS builder

WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN bun run build

# ---

FROM oven/bun:latest

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next/standalone .
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next/static ./.next/static

ENV NODE_ENV=production

ENTRYPOINT ["bun", "server.js"]
