from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str  # Hashed password
    role: str = Field(default="customer")  # Options: "customer", "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Updated Pydantic v2 configuration
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "Shibjyoti Roy",
                "email": "shibjyoti@example.com",
                "password": "$2b$12$hashedpasswordstring...",
                "role": "customer"
            }
        }
    )