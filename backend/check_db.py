import os
from dotenv import load_dotenv
from supabase import create_client

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(env_path)

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

print("URL:", url)
print("Key exists:", bool(key))

try:
    supabase = create_client(url, key)
    # Try to fetch courses
    res = supabase.table("courses").select("*").limit(1).execute()
    print("Courses fetch response:", res)
except Exception as e:
    print("Error:", e)
