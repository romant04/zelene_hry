# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build TypeScript
COPY . .
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-alpine
WORKDIR /app

# Copy ONLY the production-ready files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Tell Node this is production
ENV NODE_ENV=production

# Render assigns a dynamic port; your app MUST use process.env.PORT
# We'll use 10000 as a standard Render default fallback
ENV PORT=10000
EXPOSE 10000

CMD ["node", "dist/server.js"]