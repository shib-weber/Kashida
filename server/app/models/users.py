from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str  # Hashed password
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Shibjyoti Roy",
                "email": "shibjyoti@example.com",
                "password": "$2b$12$hashedpasswordstring...",
            }
        }