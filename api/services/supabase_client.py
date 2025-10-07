import os
from supabase import create_client, Client
from dotenv import load_dotenv

_load = load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

_supabase: Client | None = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            raise RuntimeError("Supabase URL/Key not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in api/.env")
        _supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    return _supabase
