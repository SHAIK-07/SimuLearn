import os
from dotenv import load_dotenv

# Load .env file from the parent/root directory
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
load_dotenv(env_path)

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY", "")
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "simulearn-sync-secret-key-2026")

    # Validate essential environment variables
    def check_env(self):
        if not self.SUPABASE_URL:
            print("WARNING: SUPABASE_URL or VITE_SUPABASE_URL is not set.")
        if not self.SUPABASE_KEY:
            print("WARNING: SUPABASE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY is not set.")

settings = Settings()
settings.check_env()
