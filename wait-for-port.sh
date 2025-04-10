#!/bin/bash

# Usage: ./wait-for-port.sh host port
# Example: ./wait-for-port.sh backend 8080

HOST=$1
PORT=$2
TIMEOUT=${3:-60}

# Default timeout to 60 seconds if not provided
if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "❌ Please provide a host and port as arguments (e.g., ./wait-for-port.sh backend 8080)"
  exit 1
fi

echo "⏳ Waiting for $HOST:$PORT (checking / and /health endpoints) to be ready..."

# Try connecting up to $TIMEOUT times
for ((i=0; i<$TIMEOUT; i++)); do
  # Check the root endpoint first
  if curl --silent --head --fail "http://$HOST:$PORT/" > /dev/null 2>&1; then
    echo "✅ $HOST:$PORT/ is ready!"
    exit 0
  fi

  # Check the /health endpoint as fallback
  if curl --silent --head --fail "http://$HOST:$PORT/health" > /dev/null 2>&1; then
    echo "✅ $HOST:$PORT/health is ready!"
    exit 0
  fi

  sleep 1
done

echo "❌ Timed out waiting for $HOST:$PORT (/ or /health)"
exit 1
