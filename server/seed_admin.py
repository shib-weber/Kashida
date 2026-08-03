import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load variables from server/.env
load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_EMAIL = "shibjyoti252@gmail.com"
ADMIN_PASSWORD = "123"

# Fetch Atlas connection string from .env, with a safety fallback
MONGO_URI = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DATABASE_NAME", "kashida_db")

async def create_initial_admin():
    print(f"📡 Connecting to database...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing:
        print(f"⚠️ Admin user '{ADMIN_EMAIL}' already exists in Atlas!")
        return

    admin_doc = {
        "name": "Shibjyoti Roy",
        "email": ADMIN_EMAIL,
        "password": pwd_context.hash(ADMIN_PASSWORD),
        "role": "admin",
        "is_primary": True
    }
    
    res = await db.users.insert_one(admin_doc)
    print(f"✅ Primary Admin Created Successfully in MongoDB Atlas! ID: {res.inserted_id}")

if __name__ == "__main__":
    asyncio.run(create_initial_admin())