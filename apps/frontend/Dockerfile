# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM oven/bun:1.2.19-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/
RUN bun install --frozen-lockfile

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM deps AS builder

COPY packages/shared/ ./packages/shared/
RUN bun run --cwd packages/shared build

COPY apps/frontend/ ./apps/frontend/
RUN mkdir -p /app/apps/frontend/public

# NEXT_PUBLIC_API_URL is baked into client bundle at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run --cwd apps/frontend build

# ── Stage 3: Production runner ─────────────────────────────────────────────────
FROM oven/bun:1.2.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy node_modules (workspace symlink @relaix/shared → ../../packages/shared)
COPY --from=builder /app/node_modules ./node_modules
# Copy symlink target
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
# Copy frontend app
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/apps/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next ./apps/frontend/.next

USER nextjs
WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["bun", "run", "start"]
