# Backend Production Dockerfile for AuctionX
FROM node:20-alpine AS builder

# Install OpenSSL and libc6-compat for Prisma engine on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy full source code
COPY . .

# Generate Prisma Client & build TypeScript
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

# Install OpenSSL and libc6-compat for Prisma engine runtime on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy package manifests and install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
