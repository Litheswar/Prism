import os
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load env from api/.env
BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / '.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise SystemExit('Missing SUPABASE_URL or SUPABASE_ANON_KEY in api/.env')

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

DATA_FILE = Path(__file__).resolve().parents[2] / 'data' / 'sample_projects.json'

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Upsert into public.projects by code as a natural key
# Ensure your projects table has a unique index on code, or adjust conflict target accordingly
resp = supabase.table('projects').upsert(projects, on_conflict='code').execute()
print(f"Upserted {len(projects)} projects. Status: {getattr(resp, 'status_code', 'ok')}")
