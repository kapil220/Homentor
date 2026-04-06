#!/bin/bash

echo "Starting Homentor Application in Development Mode..."
echo "=============================="

# 1. Start Backend (Port 5000)
echo "Starting Backend on Port 5000..."
cd homentor-backend-main
npm start &
BACKEND_PID=$!
cd ..

sleep 2

# 2. Start Admin Panel
echo "Starting Admin Panel (Vite defaults to 5173)..."
cd "homentor-admin panel"
npm run dev -- --mode development &
ADMIN_PID=$!
cd ..

# 3. Start Frontend
echo "Starting Frontend on Port 3000..."
cd homentor-frontend
# Running with npm run dev
npm run dev -- --mode development &
FRONTEND_PID=$!
cd ..

echo "=============================="
echo "Backend is running (PID: $BACKEND_PID) -> http://localhost:5000"
echo "Admin Panel is running (PID: $ADMIN_PID) -> http://localhost:5173"
echo "Frontend is running (PID: $FRONTEND_PID) -> http://localhost:3000"
echo "Press Ctrl+C to stop all services."

# Trap Ctrl+C to stop all background processes
trap "kill $BACKEND_PID $ADMIN_PID $FRONTEND_PID; exit" INT TERM
wait
