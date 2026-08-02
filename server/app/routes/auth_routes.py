from fastapi import APIRouter
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.controllers.auth_controller import AuthController

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
async def register(user: UserCreate):
    return await AuthController.register(user)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    return await AuthController.login(credentials)