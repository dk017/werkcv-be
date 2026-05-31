# ─────────────────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Skip postinstall scripts (Puppeteer tries to download Chrome here — we don't want that)
RUN npm ci --ignore-scripts

# Generate Prisma client (needs schema.prisma from above)
RUN npx prisma generate

# ─────────────────────────────────────────────────────────
# Stage 2: Build the Next.js app
# ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Don't download Chromium during build — we use system Chromium at runtime
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NEXT_TELEMETRY_DISABLED=1

# Dummy env vars needed so module-level singletons (Prisma Pool, OpenAI) don't
# fail during Next.js static analysis. Real values come from .env at runtime.
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV OPENAI_API_KEY=dummy

RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 3: Production runtime
# ─────────────────────────────────────────────────────────
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Install Chromium + system libs required by Puppeteer for PDF generation
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-open-sans \
    fonts-noto-color-emoji \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libwayland-client0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxtst6 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Prisma CLI so we can run db push/migrate at container startup
RUN npm install -g prisma

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Tell Puppeteer to use the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
# Chromium needs a writable HOME for its crashpad database
ENV HOME=/tmp
ENV NODE_PATH=/usr/local/lib/node_modules
ENV PROFILE_PHOTO_STORAGE_DIR=/app/storage/profile-photos

# Non-root user for security
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs
RUN mkdir -p /app/storage/profile-photos \
    && chown -R nextjs:nodejs /app/storage

# Copy the Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema so the CLI can run migrations at startup
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./entrypoint.sh"]
