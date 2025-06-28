# DeckDex - MTG Card Sorter

Automated Magic: The Gathering deck management system with a React frontend and Python backend.

## Setup

Run the setup script to install all dependencies:

```bash
./setup.sh
```

## Development

Start both frontend and backend in development mode:

```bash
npm run dev
```

Or start them individually:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Using the Build Script

The `build.sh` script provides an easy way to install dependencies, build, and run the application:

```bash
# Make the script executable
chmod +x build.sh

# Run both frontend and backend in development mode (default)
./build.sh

# Install dependencies only
./build.sh install

# Build the frontend
./build.sh build

# Run only the frontend
./build.sh frontend

# Run only the backend
./build.sh backend

# Build and run in production mode
./build.sh production

# Show help
./build.sh help
```

## Building for Production

```bash
# Build frontend
npm run build:frontend

# Start services
npm run start:frontend
npm run start:backend
```
