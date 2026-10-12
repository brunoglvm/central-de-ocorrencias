FROM node:22-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN npm install -g pnpm@11

WORKDIR /app

FROM base AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS runtime

ENV NODE_ENV=production

RUN mkdir -p /app/src/database

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

EXPOSE 3333

CMD ["node", "dist/index.mjs"]
