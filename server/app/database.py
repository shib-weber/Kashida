import motor.motor_asyncio
import redis.asyncio as aioredis
import certifi
from app.config import settings

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db = None
    redis = None

db = Database()

async def connect_to_db():
    try:
        # Explicitly pass tlsAllowInvalidCertificates to bypass Windows OpenSSL handshake blocks
        db.client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000  # Fast fail fallback
        )
        db.db = db.client[settings.DATABASE_NAME]
        print("✅ MongoDB Motor client initialized")
    except Exception as e:
        print(f"❌ MongoDB initialization error: {e}")

    # Initialize Redis connection
    try:
        db.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        print("✅ Redis client initialized")
    except Exception as e:
        print(f"⚠️ Redis connection warning: {e}")

async def close_db():
    if db.client:
        db.client.close()
    if db.redis:
        await db.redis.close()
    print("🛑 Database connections closed")