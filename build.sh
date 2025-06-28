#!/bin/bash

# DeckDex Build & Run Script
# This script handles installation, building, and running both frontend and backend services

set -e  # Exit immediately if a command exits with a non-zero status

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

print_section() {
  echo -e "\n${BOLD}${BLUE}==== $1 ====${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

# Check for required tools
check_requirements() {
  print_section "Checking Requirements"
  
  # Check for Node.js
  if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js before continuing."
    echo "Visit https://nodejs.org/ for installation instructions."
    exit 1
  else
    NODE_VERSION=$(node -v)
    print_success "Node.js ${NODE_VERSION} is installed"
  fi
  
  # Check for npm
  if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm before continuing."
    exit 1
  else
    NPM_VERSION=$(npm -v)
    print_success "npm ${NPM_VERSION} is installed"
  fi
  
  # Check for Python
  if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 before continuing."
    echo "Visit https://www.python.org/downloads/ for installation instructions."
    exit 1
  else
    PYTHON_VERSION=$(python3 --version)
    print_success "${PYTHON_VERSION} is installed"
  fi
}

# Install dependencies
install_dependencies() {
  print_section "Installing Dependencies"
  
  # Install root dependencies
  print_info "Installing root dependencies..."
  npm install
  print_success "Root dependencies installed"
  
  # Install frontend dependencies
  print_info "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
  print_success "Frontend dependencies installed"
  
  # Install backend dependencies (if any)
  # Currently the backend uses only standard library modules
  print_success "Backend dependencies checked"
}

# Build the frontend
build_frontend() {
  print_section "Building Frontend"
  cd frontend
  npm run build
  cd ..
  print_success "Frontend built successfully"
}

# Run both services
run_services() {
  print_section "Running Services"
  print_info "Starting frontend and backend services..."
  print_info "Frontend will be available at: http://localhost:5173"
  print_info "Backend API will be available at: http://localhost:8000"
  print_info "Press Ctrl+C to stop both services"
  npm run dev
}

# Run only the frontend
run_frontend() {
  print_section "Running Frontend Only"
  print_info "Starting frontend service..."
  print_info "Frontend will be available at: http://localhost:5173"
  print_info "Press Ctrl+C to stop the service"
  npm run dev:frontend
}

# Run only the backend
run_backend() {
  print_section "Running Backend Only"
  print_info "Starting backend service..."
  print_info "Backend API will be available at: http://localhost:8000"
  print_info "Press Ctrl+C to stop the service"
  npm run dev:backend
}

# Production start
start_production() {
  print_section "Starting Production Services"
  print_info "Starting frontend and backend services in production mode..."
  print_info "Press Ctrl+C to stop both services"
  
  # Start both services in the background
  npm run start:frontend & FRONTEND_PID=$!
  npm run start:backend & BACKEND_PID=$!
  
  # Wait for either service to exit
  wait $FRONTEND_PID $BACKEND_PID
  
  # Kill the other service if one exits
  kill $FRONTEND_PID $BACKEND_PID 2>/dev/null || true
}

# Display help message
show_help() {
  echo "DeckDex Build & Run Script"
  echo "Usage: ./build.sh [OPTION]"
  echo ""
  echo "Options:"
  echo "  install       Install dependencies only"
  echo "  build         Build the frontend"
  echo "  dev           Run both frontend and backend in development mode (default)"
  echo "  frontend      Run only the frontend in development mode"
  echo "  backend       Run only the backend"
  echo "  production    Build and run in production mode"
  echo "  help          Show this help message"
}

# Main execution
main() {
  # Check requirements first
  check_requirements
  
  # Process command line arguments
  case "$1" in
    install)
      install_dependencies
      ;;
    build)
      install_dependencies
      build_frontend
      ;;
    frontend)
      install_dependencies
      run_frontend
      ;;
    backend)
      install_dependencies
      run_backend
      ;;
    production)
      install_dependencies
      build_frontend
      start_production
      ;;
    help)
      show_help
      ;;
    *)
      # Default: run both services in development mode
      install_dependencies
      run_services
      ;;
  esac
}

# Execute main function with all command line arguments
main "$@"
