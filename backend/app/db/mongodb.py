import motor.motor_asyncio
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

async def connect_to_mongo():
    try:
        await client.admin.command('ping')
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    client.close()
    logger.info("Closed MongoDB connection")

