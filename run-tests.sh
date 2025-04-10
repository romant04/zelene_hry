#!/bin/bash

set -e

echo "🚀 Starting services..."
docker-compose --env-file .test.env up -d --build

# Wait for each service to open its port
./wait-for-port.sh localhost 5173  # frontend
./wait-for-port.sh localhost 3000  # websocket
./wait-for-port.sh localhost 8080  # backend

echo "🎯 All services are up. Running Playwright tests..."
cd frontend
npm run test

echo "🧹 Cleaning up..."
docker-compose down > /dev/null 2>&1
