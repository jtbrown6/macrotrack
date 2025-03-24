FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies for both client and server
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build client
RUN cd client && npm run build

# Build server
RUN cd server && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY --from=build /app/package*.json ./
COPY --from=build /app/server/package*.json ./server/

# Copy built files from client and server
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/server/dist ./server/dist

# Install production dependencies only
RUN npm ci --only=production
RUN cd server && npm ci --only=production

# Create data directory for persistent storage
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3003

# Expose port
EXPOSE 3003

# Set the command to run the server
CMD ["node", "server/dist/index.js"]
