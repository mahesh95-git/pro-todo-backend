FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY  . .
RUN npx prisma generate

RUN npm run build


# Production stage

FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000
CMD ["node", "dist/server.js"]

