#!/bin/bash

# Define Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
RESET='\033[0m'

echo -e "${BLUE}Starting Homentor Application Runner...${RESET}"
echo "=============================="

# Function to check and install dependencies
check_npm_install() {
    local dir=$1
    local name=$2
    echo -e "${YELLOW}Checking dependencies for $name...${RESET}"
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "${YELLOW}node_modules not found in $name. Installing...${RESET}"
        (cd "$dir" && npm install)
    else
        echo -e "${GREEN}Dependencies already installed for $name.${RESET}"
    fi
}

# Function to check if a port is in use
check_port() {
    local port=$1
    local name=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Error: Port $port is already in use (by $name or another process).${RESET}"
        return 1
    fi
    return 0
}

# 1. Check Dependencies
check_npm_install "homentor-backend-main" "Backend"
check_npm_install "homentor-admin panel" "Admin Panel"
check_npm_install "homentor-frontend" "Frontend"

# 2. Check Ports
check_port 5000 "Backend" || exit 1
check_port 5173 "Admin Panel" || exit 1
check_port 3000 "Frontend" || exit 1

# 3. Load environment variables
export VITE_API_BASE_URL="http://localhost:5000/api"

echo -e "${BLUE}All checks passed. Starting services...${RESET}"
echo "=============================="

# 4. Start Backend
echo -e "${GREEN}Starting Backend on Port 5000...${RESET}"
cd homentor-backend-main
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 5. Start Admin Panel
echo -e "${GREEN}Starting Admin Panel on Port 5173...${RESET}"
cd "homentor-admin panel"
npm run dev -- --mode development > ../admin.log 2>&1 &
ADMIN_PID=$!
cd ..

# 6. Start Frontend
echo -e "${GREEN}Starting Frontend on Port 3000...${RESET}"
cd homentor-frontend
npm run dev -- --mode development > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "=============================="
echo -e "${GREEN}Backend is running (PID: $BACKEND_PID)${RESET}"
echo -e "${GREEN}Admin Panel is running (PID: $ADMIN_PID) -> http://localhost:5173${RESET}"
echo -e "${GREEN}Frontend is running (PID: $FRONTEND_PID) -> http://localhost:3000${RESET}"
echo -e "${YELLOW}Logs are being written to backend.log, admin.log, and frontend.log${RESET}"
echo "Press Ctrl+C to stop all services."

# Trap Ctrl+C to stop all background processes
cleanup() {
    echo -e "\n${RED}Stopping all services...${RESET}"
    kill $BACKEND_PID $ADMIN_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

# Keep the script running
wait
