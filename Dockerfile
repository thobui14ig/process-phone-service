
# =======================
# BUILD STAGE
# =======================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài dependencies
COPY package.json package-lock.json ./
RUN npm install

# Build ứng dụng
COPY . .
RUN npm run build

# Chỉ cài production dependencies
RUN npm prune --omit=dev

# =======================
# PRODUCTION STAGE
# =======================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Chạy ứng dụng bằng user không phải root
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

USER node

EXPOSE 4000

CMD ["node", "dist/main.js"]
