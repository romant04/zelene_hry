FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build the application
RUN npm run build

# The application will run on port 5173
EXPOSE 5173

# Start the application
CMD ["node", "build"]