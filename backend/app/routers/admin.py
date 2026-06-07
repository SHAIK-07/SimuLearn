from fastapi import APIRouter, Header, HTTPException, status
from app.config import settings
from app.dependencies import supabase_client
from app.services.sync_engine import sync_courses_filesystem_to_db
import os

router = APIRouter()

@router.post("/sync")
async def trigger_content_sync(x_admin_secret: str = Header(None)):
    """
    Endpoint that parses the local filesystem Courses/ directory and upserts into Supabase.
    """
    if not x_admin_secret or x_admin_secret != settings.ADMIN_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing admin secret key"
        )
    
    # Path to Courses directory (root of repository)
    courses_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Courses"))
    
    try:
        results = sync_courses_filesystem_to_db(supabase_client, courses_root)
        return {
            "status": "success",
            "message": "Content synchronization completed successfully.",
            "results": results
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Content sync failed: {str(e)}"
        )
