from fastapi import HTTPException, status
from app.database import db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse, UserProfileResponse
from app.utils.auth import hash_password, verify_password, create_access_token
from bson import ObjectId

class AuthController:
    @staticmethod
    async def register(user_data: UserCreate) -> TokenResponse:
        existing = await db.db.users.find_one({"email": user_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_doc = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hash_password(user_data.password),
            "phone": "",
            "address": ""
        }
        result = await db.db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        token = create_access_token({"sub": user_id, "email": user_data.email})
        return TokenResponse(
            token=token,
            user=UserResponse(id=user_id, name=user_data.name, email=user_data.email)
        )

    @staticmethod
    async def login(credentials: UserLogin) -> TokenResponse:
        user = await db.db.users.find_one({"email": credentials.email})
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user_id = str(user["_id"])
        token = create_access_token({"sub": user_id, "email": user["email"]})
        return TokenResponse(
            token=token,
            user=UserResponse(id=user_id, name=user["name"], email=user["email"])
        )

    @staticmethod
    async def get_profile(user_id: str) -> UserProfileResponse:
        try:
            user = await db.db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid User ID format")

        if not user:
            raise HTTPException(status_code=404, detail="User profile not found")

        return UserProfileResponse(
            id=str(user["_id"]),
            name=user.get("name", ""),
            email=user.get("email", ""),
            phone=user.get("phone", ""),
            address=user.get("address", "")
        )