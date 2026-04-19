# ── Stage 1: Install dependencies (shared) ────────────────────────────────────
FROM oven/bun:1.2.19-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
RUN bun install --frozen-lockfile

# ── Stage 2: Build shared package (shared) ────────────────────────────────────
FROM deps AS shared-builder

COPY packages/shared/ ./packages/shared/
RUN bun run --cwd packages/shared build

# ── Stage 3a: Build backend ────────────────────────────────────────────────────
FROM shared-builder AS backend-builder

COPY apps/backend/ ./apps/backend/
RUN bun run --cwd apps/backend build

# ── Stage 3b: Build frontend ───────────────────────────────────────────────────
FROM shared-builder AS frontend-builder

COPY apps/frontend/ ./apps/frontend/
RUN mkdir -p /app/apps/frontend/public

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run --cwd apps/frontend build

# ── Stage 4a: Backend runner ───────────────────────────────────────────────────
FROM node:20-alpine AS backend-runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=backend-builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=backend-builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist

USER nestjs
EXPOSE 3001
CMD ["node", "dist/main"]

# ── Stage 4b: Frontend runner ──────────────────────────────────────────────────
FROM oven/bun:1.2.19-alpine AS frontend-runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=frontend-builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=frontend-builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=frontend-builder /app/apps/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=frontend-builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=frontend-builder --chown=nextjs:nodejs /app/apps/frontend/.next ./apps/frontend/.next

USER nextjs
WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["bun", "run", "start"]
