#!/bin/bash

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Function to kill process on port
kill_port() {
    local port=$1
    lsof -ti:$port | xargs kill -9 2>/dev/null
}

# Kill any existing processes on the ports we need
echo "Stopping any existing servers..."
kill_port 3000  # Backend
kill_port 5173  # Frontend (common Vite port)
kill_port 5174  # Frontend (alternative Vite port)

# Start the backend server
echo "Starting backend server..."
cd "$ORIGINAL_DIR/server" && npm start &
BACKEND_PID=$!

# Wait a moment for the backend to start
sleep 2

# Start the frontend server
echo "Starting frontend server..."
cd "$ORIGINAL_DIR" && npm run dev &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill_port 3000
    kill_port 5173
    kill_port 5174
    exit 0
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 