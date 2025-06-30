# DeckDex

A Magic: The Gathering deck management system.

## Project Structure

- **Frontend**: React/TypeScript using Vite
- **Backend**: Python with FastAPI and Supabase

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.8+
- Supabase account

### Setting up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Once your project is created, go to the SQL Editor in the Supabase dashboard
3. Run the SQL commands from `backend/schema.sql` to set up your database tables and policies
4. Get your Supabase URL and API Key from the API settings in the Supabase dashboard
5. Create a `.env` file in the `backend` directory based on `.env.example` and add your Supabase credentials

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python server.py
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Using the Build Script

The project includes a build script that can set up and run both the frontend and backend:

```bash
# Make the script executable
chmod +x build.sh

# Run the build script
./build.sh
```

## API Documentation

Once the backend server is running, you can access the API documentation at:

```
http://localhost:8000/docs
```

This provides an interactive interface to test all available API endpoints.

## Repository

GitHub: [https://github.com/vawong/deckdex](https://github.com/vawong/deckdex)
