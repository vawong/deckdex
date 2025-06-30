#!/usr/bin/env python3

import os
import sys
import json
import time
import requests
from pathlib import Path

# Add the parent directory to the path so we can import from app
sys.path.append(str(Path(__file__).parent.parent))

# Import the Supabase client
from app.db import supabase

# Constants
BULK_DATA_URL = "https://api.scryfall.com/bulk-data"
CARDS_TABLE = "mtg_card"  # Name of the table to store card data
BATCH_SIZE = 100  # Number of cards to insert in a single batch

def check_table_exists():
    """Check if the cards table exists in Supabase"""
    try:
        # Check if the table exists by attempting a simple query
        response = supabase.table(CARDS_TABLE).select("count").limit(1).execute()
        print(f"Table '{CARDS_TABLE}' exists and is ready for data.")
        return True
    except Exception as e:
        print(f"Error checking table: {e}")
        print(f"Please make sure the '{CARDS_TABLE}' table is created in Supabase.")
        return False

def get_bulk_data_uri(data_type="default_cards"):
    """Get the URI for the latest bulk data download"""
    try:
        print(f"Fetching bulk data information from {BULK_DATA_URL}...")
        response = requests.get(BULK_DATA_URL)
        response.raise_for_status()
        data = response.json()
        
        # Find the specified bulk data item
        for item in data['data']:
            if item['type'] == data_type:
                print(f"Found {data_type} bulk data: {item['download_uri']}")
                return item['download_uri']
        
        raise ValueError(f"Could not find '{data_type}' bulk data")
    except Exception as e:
        print(f"Error getting bulk data URI: {e}")
        sys.exit(1)

def download_bulk_data(uri):
    """Download the bulk data from Scryfall"""
    print(f"Downloading bulk data from {uri}...")
    try:
        response = requests.get(uri)
        response.raise_for_status()
        
        # Parse the JSON data
        print("Parsing JSON data...")
        cards = json.loads(response.text)
        print(f"Downloaded {len(cards)} cards.")
        return cards
    except Exception as e:
        print(f"Error downloading bulk data: {e}")
        sys.exit(1)

def process_card(card):
    """Process a card object to extract relevant fields"""
    # Extract only the fields we want to store
    processed_card = {
        "id": card.get("id"),
        "name": card.get("name"),
        "set": card.get("set"),
        "set_name": card.get("set_name"),
        "mana_cost": card.get("mana_cost"),
        "cmc": card.get("cmc"),
        "type_line": card.get("type_line"),
        "oracle_text": card.get("oracle_text"),
        "rarity": card.get("rarity"),
        "scryfall_uri": card.get("scryfall_uri"),
        "price_usd": card.get("prices", {}).get("usd"),
        "price_usd_foil": card.get("prices", {}).get("usd_foil"),
    }
    
    # Handle image URIs
    if card.get("image_uris"):
        processed_card["image_uri"] = card.get("image_uris", {}).get("normal")
    elif card.get("card_faces") and len(card.get("card_faces")) > 0:
        # For double-faced cards, use the front face image
        face = card.get("card_faces")[0]
        if face.get("image_uris"):
            processed_card["image_uri"] = face.get("image_uris", {}).get("normal")
    
    # Handle JSON fields properly for Supabase
    # Supabase expects JSONB fields to be proper JSON objects/arrays
    processed_card["colors"] = card.get("colors", [])
    processed_card["color_identity"] = card.get("color_identity", [])
    processed_card["legalities"] = card.get("legalities", {})
    
    return processed_card

def insert_cards(cards):
    """Insert cards into the Supabase table in batches"""
    total_cards = len(cards)
    inserted = 0
    batches = [cards[i:i + BATCH_SIZE] for i in range(0, total_cards, BATCH_SIZE)]
    
    print(f"Inserting {total_cards} cards in {len(batches)} batches...")
    
    for i, batch in enumerate(batches):
        try:
            # Process each card to extract relevant fields
            processed_batch = [process_card(card) for card in batch]
            
            # Insert the batch into Supabase with upsert (update if exists)
            response = supabase.table(CARDS_TABLE).upsert(processed_batch).execute()
            
            inserted += len(batch)
            progress = (inserted/total_cards)*100
            print(f"Progress: {inserted}/{total_cards} cards inserted ({progress:.2f}%)")
            
            # Add a small delay between batches to avoid overwhelming the API
            if i < len(batches) - 1:
                time.sleep(0.1)
                
        except Exception as e:
            print(f"Error inserting batch {i+1}: {e}")
            # Continue with the next batch
    
    print(f"Inserted {inserted} cards successfully.")

def main():
    print("Starting Scryfall bulk data import...")
    
    # Check if the table exists
    if not check_table_exists():
        print("Exiting: Please create the mtg_card table in Supabase first.")
        sys.exit(1)
    
    # Get the bulk data URI
    uri = get_bulk_data_uri("default_cards")
    
    # Download the bulk data
    cards = download_bulk_data(uri)
    
    # Insert the cards into Supabase
    insert_cards(cards)
    
    print("Import completed successfully!")

if __name__ == "__main__":
    main()
