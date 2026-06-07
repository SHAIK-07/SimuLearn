from fastapi import Header, HTTPException, status
from supabase import create_client, Client
from app.config import settings

# Initialize Supabase client
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def get_current_user(authorization: str = Header(None)):
    """
    FastAPI dependency that validates the Bearer token against Supabase Auth.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header"
        )
    
    token = authorization.split(" ")[1]
    try:
        # Validate user token
        user_response = supabase_client.auth.get_user(token)
        return user_response.user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid session token: {str(e)}"
        )
