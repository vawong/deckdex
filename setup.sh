#!/bin/bash

echo "Setting up DeckDex monorepo..."

# Create necessary directories if they don't exist
mkdir -p frontend
mkdir -p backend

# Setup Frontend (React/TypeScript)
echo "\nSetting up frontend dependencies..."
cd frontend

# Check if package.json exists, if not create it
if [ ! -f package.json ]; then
  echo "Creating package.json..."
  npm init -y
  
  # Update package.json with necessary fields
  npm pkg set name="deckdex-frontend"
  npm pkg set version="0.1.0"
  npm pkg set private=true
  npm pkg set scripts.dev="next dev"
  npm pkg set scripts.build="next build"
  npm pkg set scripts.start="next start"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install react react-dom next
npm install lucide-react

# Install dev dependencies
npm install --save-dev typescript @types/react @types/react-dom eslint

# Install UI components (Shadcn UI dependencies)
npm install @radix-ui/react-tabs @radix-ui/react-slot class-variance-authority clsx tailwindcss postcss autoprefixer

# Create tsconfig.json if it doesn't exist
if [ ! -f tsconfig.json ]; then
  echo "Creating TypeScript configuration..."
  cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
fi

# Create next.config.js if it doesn't exist
if [ ! -f next.config.js ]; then
  echo "Creating Next.js configuration..."
  cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOF
fi

# Setup Tailwind CSS
if [ ! -f tailwind.config.js ]; then
  echo "Setting up Tailwind CSS..."
  npx tailwindcss init -p
  
  # Update tailwind.config.js
  cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

  # Create CSS file
  mkdir -p styles
  cat > styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
fi

# Create pages directory and index.tsx if they don't exist
if [ ! -d pages ]; then
  echo "Creating pages directory and index.tsx..."
  mkdir -p pages
  cp Index.tsx pages/index.tsx 2>/dev/null || :
  
  # If the copy failed, create a simple index.tsx
  if [ ! -f pages/index.tsx ]; then
    cat > pages/index.tsx << 'EOF'
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">DeckDex</h1>
        <p className="text-blue-200">Welcome to DeckDex</p>
      </div>
    </div>
  );
}
EOF
  fi
fi

# Return to root directory
cd ..

# Setup Backend (Python)
echo "\nSetting up backend dependencies..."
cd backend

# Create a simple Python script without any dependencies
echo "Creating a simple Python backend..."
cat > server.py << 'EOF'
#!/usr/bin/env python3

import http.server
import json
import socketserver
from urllib.parse import urlparse, parse_qs

# Configuration
PORT = 8000
HOST = "0.0.0.0"

class DeckDexHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # Set CORS headers for all responses
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        
        # API Routes
        if parsed_path.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = {"message": "Welcome to DeckDex API"}
            self.wfile.write(json.dumps(response).encode())
            return
        elif parsed_path.path == "/health":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = {"status": "healthy"}
            self.wfile.write(json.dumps(response).encode())
            return
        else:
            # Serve static files
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

if __name__ == "__main__":
    print(f"Starting DeckDex server on http://{HOST}:{PORT}")
    httpd = socketserver.TCPServer((HOST, PORT), DeckDexHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()
EOF

# Make the server script executable
chmod +x server.py

# Return to root directory
cd ..

# Create .env file if it doesn't exist or is empty
if [ ! -s .env ]; then
  echo "Creating .env file..."
  cat > .env << 'EOF'
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend Environment Variables
PORT=8000
ENVIRONMENT=development
EOF
fi

# Create root package.json for monorepo management if it doesn't exist
if [ ! -f package.json ]; then
  echo "Creating monorepo package.json..."
  cat > package.json << 'EOF'
{
  "name": "deckdex",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "frontend"
  ],
  "scripts": {
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && python3 server.py",
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "build:frontend": "cd frontend && npm run build",
    "start:frontend": "cd frontend && npm run start",
    "start:backend": "cd backend && python3 server.py"
  },
  "devDependencies": {
    "concurrently": "^8.2.1"
  }
}
EOF

  # Install concurrently for running both services
  npm install
fi

# Create README.md if it doesn't exist
if [ ! -f README.md ]; then
  echo "Creating README.md..."
  cat > README.md << 'EOF'
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

## Building for Production

```bash
# Build frontend
npm run build:frontend

# Start services
npm run start:frontend
npm run start:backend
```
EOF
fi

# Make the setup script executable
chmod +x setup.sh

echo "\nSetup complete! You can now run 'npm run dev' to start both frontend and backend servers."
