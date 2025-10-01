# === Builder stage ===
FROM node:20.19-alpine AS builder

WORKDIR /app

# Install build dependencies (for native modules)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./

# Install all dependencies (including dev) for building
RUN npm ci

COPY . .

# Build the production Next.js app
RUN npm run build

# === Runtime / production stage ===
FROM node:20.19-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copy only the built assets and minimal required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*

# Install only production dependencies
RUN npm ci --omit=dev \
    && rm -rf /root/.npm /tmp/*

EXPOSE 3000

RUN adduser -D appuser && chown -R appuser:appuser /app
USER appuser

CMD ["npm", "run", "start"]
