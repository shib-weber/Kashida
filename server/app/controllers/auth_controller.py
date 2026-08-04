from fastapi import HTTPException, status
from app.database import db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse, UserProfileResponse,ProfileUpdateRequest
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
            "role": "customer",  # Default role for public signups
            "phone": "",
            "address": ""
        }
        result = await db.db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        token = create_access_token({"sub": user_id, "email": user_data.email, "role": "customer"})
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
        user_role = user.get("role", "customer")
        token = create_access_token({"sub": user_id, "email": user["email"], "role": user_role})
        
        return TokenResponse(
            token=token,
            user=UserResponse(id=user_id, name=user.get("name", "User"), email=user["email"])
        )

    @staticmethod
    async def admin_login(credentials: UserLogin) -> TokenResponse:
        """
        Dedicated login method for Admin Portal.
        Strictly rejects users without role == 'admin'.
        """
        user = await db.db.users.find_one({"email": credentials.email})
        if not user or not verify_password(credentials.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid admin credentials"
            )
        
        if user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Forbidden: Account does not have admin privileges"
            )
        
        user_id = str(user["_id"])
        token = create_access_token({"sub": user_id, "email": user["email"], "role": "admin"})
        
        return TokenResponse(
            token=token,
            user=UserResponse(id=user_id, name=user.get("name", "Admin"), email=user["email"])
        )

    @staticmethod
    async def update_profile(user_id: str, payload: ProfileUpdateRequest) -> UserProfileResponse:
        try:
            # Filter out None fields so unsubmitted fields aren't cleared
            update_data = payload.model_dump(exclude_unset=True)
            
            if not update_data:
                raise HTTPException(status_code=400, detail="No fields provided for update")

            # Update document in MongoDB Atlas matching user_id
            result = await db.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )

            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User profile not found")

            # Return updated profile data
            return await AuthController.get_profile(user_id)
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Error updating user profile: {e}")
            raise HTTPException(status_code=500, detail="Failed to update profile")

    @staticmethod
    async def create_admin(new_admin_data: UserCreate, created_by_id: str) -> dict:
        """
        Allows an active admin to register secondary admin accounts.
        """
        existing = await db.db.users.find_one({"email": new_admin_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        admin_doc = {
            "name": getattr(new_admin_data, "name", "Admin User"),
            "email": new_admin_data.email,
            "password": hash_password(new_admin_data.password),
            "role": "admin",
            "created_by": created_by_id,
            "phone": "",
            "address": ""
        }

        result = await db.db.users.insert_one(admin_doc)
        return {
            "message": "Secondary admin account created successfully",
            "admin_id": str(result.inserted_id)
        }

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