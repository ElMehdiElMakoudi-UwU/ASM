# syntax=docker/dockerfile:1
# Next.js standalone build for Coolify. Three stages so the runtime image
# carries only the server, the traced dependencies and the assets.

FROM node:22-alpine AS base
# Next's musl builds need this shim.
RUN apk add --no-cache libc6-compat

# ---- dependencies -----------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time, and sitemap.xml / robots.txt
# are generated during the build — so the production URL must be a build arg,
# not just a runtime variable. Set it in Coolify's Build Variables.
ARG NEXT_PUBLIC_SITE_URL=https://www.asm-architectes.ma
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Deliberately not `npm run build`: that script redirects output to .next-build
# to protect a running dev server, which the standalone copy paths below do not
# expect. In the container the default .next is correct.
RUN npx next build

# ---- runtime ----------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Coolify health check: /api/health (not /, which 307s to /fr).
CMD ["node", "server.js"]
