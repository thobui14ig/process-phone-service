# =======================
# BUILD STAGE
# =======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm prune --omit=dev

# =======================
# PRODUCTION STAGE
# =======================
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Chạy ứng dụng bằng user không phải root
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 4000
CMD ["node", "dist/main.js"]
