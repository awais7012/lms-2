from app.db.mongodb import db
from app.core.security import get_password_hash
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def create_first_superuser():
    """Create a superuser if it doesn't exist."""
    try:
        # Check if admin user exists
        admin_user = await db.users.find_one({"email": settings.FIRST_SUPERUSER_EMAIL})
        
        if not admin_user:
            user_data = {
                "email": settings.FIRST_SUPERUSER_EMAIL,
                "username": "admin",
                "hashed_password": get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                "role": "admin",
                "is_active": True,
                "is_superuser": True
            }
            
            await db.users.insert_one(user_data)
            logger.info("Superuser created")
        else:
            logger.info("Superuser already exists")
    except Exception as e:
        logger.error(f"Error creating superuser: {e}")

