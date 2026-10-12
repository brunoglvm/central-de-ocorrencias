FROM node:24-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN npm install -g pnpm@11

WORKDIR /app

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
