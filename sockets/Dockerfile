# Use Node 20 with Alpine for a lightweight image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy TypeScript source files
COPY . .

# Build TypeScript
RUN npm run build

# Start the WebSocket server
CMD ["node", "dist/server.js"]
