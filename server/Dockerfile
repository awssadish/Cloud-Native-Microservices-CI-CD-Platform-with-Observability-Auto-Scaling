# -------- Stage 1: Build --------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# -------- Stage 2: Runtime --------
FROM node:20-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app ./

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]