from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# Import the Supabase client
from .db import supabase

app = FastAPI(title="DeckDex API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to DeckDex API"}

@app.get("/health")
async def health_check():
    # Test the Supabase connection
    try:
        # Simple query to check if Supabase is connected
        response = supabase.table('health_check').select('*').limit(1).execute()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "healthy", "database": str(e)}

# Example model for a deck
class Deck(BaseModel):
    name: str
    format: str
    description: Optional[str] = None

# Example API endpoints for decks
@app.post("/decks")
async def create_deck(deck: Deck):
    try:
        response = supabase.table('decks').insert(deck.dict()).execute()
        return response.data[0] if response.data else {"message": "Deck created"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/decks")
async def get_decks():
    try:
        response = supabase.table('decks').select('*').execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/decks/{deck_id}")
async def get_deck(deck_id: str):
    try:
        response = supabase.table('decks').select('*').eq('id', deck_id).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
