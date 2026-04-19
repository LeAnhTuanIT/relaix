# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM oven/bun:1.2.19-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
RUN bun install --frozen-lockfile

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM deps AS builder

COPY packages/shared/ ./packages/shared/
RUN bun run --cwd packages/shared build

COPY apps/backend/ ./apps/backend/
RUN bun run --cwd apps/backend build

# ── Stage 3: Production runner ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

# Copy node_modules (workspace symlink @relaix/shared → ../../packages/shared)
COPY --from=builder /app/node_modules ./node_modules
# Copy symlink target so @relaix/shared resolves correctly
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
# Copy compiled backend
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist

USER nestjs
EXPOSE 3001
CMD ["node", "dist/main"]
