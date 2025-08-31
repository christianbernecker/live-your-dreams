# Live Your Dreams Backoffice - Production Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/backoffice/ ./apps/backoffice/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build design system first
RUN pnpm --filter @liveyourdreams/design-tokens build
RUN pnpm --filter @liveyourdreams/design-system build  
RUN pnpm --filter @liveyourdreams/design-system-react build

# Build backoffice
RUN pnpm --filter @liveyourdreams/backoffice build

# Production image
FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# Copy built application
COPY --from=base /app/apps/backoffice/.next ./apps/backoffice/.next
COPY --from=base /app/apps/backoffice/public ./apps/backoffice/public
COPY --from=base /app/apps/backoffice/package.json ./apps/backoffice/
COPY --from=base /app/apps/backoffice/next.config.mjs ./apps/backoffice/
COPY --from=base /app/apps/backoffice/prisma ./apps/backoffice/prisma
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-workspace.yaml ./

# Copy built packages
COPY --from=base /app/packages ./packages

# Create non-root user
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs
USER nextjs

WORKDIR /app/apps/backoffice

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["pnpm", "start"]
