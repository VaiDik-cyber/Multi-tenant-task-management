# Stage 1: Build React Frontend
FROM node:18-alpine as builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
# Set API URL to empty string for relative paths (same origin)
ENV VITE_API_URL="/"
RUN npm run build

# Stage 2: Setup Production Server
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Install Backend Dependencies
COPY package*.json ./
RUN npm install --production

# Copy Backend Source Code
COPY config ./config
COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY index.js ./

# Copy Built Frontend from Builder Stage
COPY --from=builder /app/client/dist ./client/dist

# Expose Port
EXPOSE 3000

# Start Server
CMD ["node", "index.js"]
