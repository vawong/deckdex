from fastapi import APIRouter, HTTPException, Query, status
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# Import the Supabase client
from ..db import supabase

router = APIRouter(prefix="/cards", tags=["cards"])

class CardBase(BaseModel):
    id: str
    name: str
    set: Optional[str] = None
    set_name: Optional[str] = None
    mana_cost: Optional[str] = None
    cmc: Optional[float] = None
    type_line: Optional[str] = None
    oracle_text: Optional[str] = None
    colors: Optional[List[str]] = None
    color_identity: Optional[List[str]] = None
    rarity: Optional[str] = None
    image_uri: Optional[str] = None
    scryfall_uri: Optional[str] = None
    price_usd: Optional[str] = None
    price_usd_foil: Optional[str] = None
    legalities: Optional[Dict[str, str]] = None

@router.get("/", response_model=List[CardBase])
async def get_cards(
    name: Optional[str] = None,
    set_code: Optional[str] = None,
    type_line: Optional[str] = None,
    color: Optional[str] = None,
    rarity: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get cards with optional filtering"""
    try:
        query = supabase.table("mtg_card").select("*")
        
        # Apply filters if provided
        if name:
            query = query.ilike("name", f"%{name}%")
        if set_code:
            query = query.eq("set", set_code)
        if type_line:
            query = query.ilike("type_line", f"%{type_line}%")
        if rarity:
            query = query.eq("rarity", rarity)
        
        # Apply pagination
        query = query.range(offset, offset + limit - 1)
        
        # Execute the query
        response = query.execute()
        
        # Process the results
        cards = response.data
        
        # If color filter is provided, filter in Python
        # (since we can't easily filter JSONB arrays in Supabase)
        if color and cards:
            filtered_cards = []
            for card in cards:
                if card.get("colors") and color.lower() in card.get("colors", "").lower():
                    filtered_cards.append(card)
            cards = filtered_cards
        
        return cards
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{card_id}", response_model=CardBase)
async def get_card(card_id: str):
    """Get a specific card by ID"""
    try:
        response = supabase.table("mtg_card").select("*").eq("id", card_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
        
        return response.data[0]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/search/{query}", response_model=List[CardBase])
async def search_cards(query: str, limit: int = Query(20, ge=1, le=100)):
    """Search cards by name, type, or text"""
    try:
        # Search in name, type_line, and oracle_text
        response = supabase.table("mtg_card").select("*").or_(
            f"name.ilike.%{query}%,type_line.ilike.%{query}%,oracle_text.ilike.%{query}%"
        ).limit(limit).execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
