from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr

class UserProfileResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    address: Optional[str] = ""

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None