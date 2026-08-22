# Use official lightweight Node.js Alpine base image
FROM node:20-alpine AS base

# Set working directory inside container
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Install dependencies in a separate layer for efficient caching
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY server.js ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY public/ ./public/
COPY routes/ ./routes/
COPY services/ ./services/
COPY utils/ ./utils/
COPY validators/ ./validators/
COPY views/ ./views/

# Use non-root node user for enhanced security
USER node

# Expose server port
EXPOSE 3000

# Health check using the application's built-in /ready endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3000}/ready || exit 1

# Start the Express server
CMD ["node", "server.js"]
