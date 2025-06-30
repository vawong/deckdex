import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Get Supabase credentials from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

def get_supabase_client() -> Client:
    """Create and return a Supabase client instance"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError(
            "Supabase URL and API key must be set in environment variables "
            "(SUPABASE_URL, SUPABASE_API_KEY)"
        )
    
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize the client
supabase = get_supabase_client()
