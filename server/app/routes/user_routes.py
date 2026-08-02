from fastapi import APIRouter, Depends
from app.schemas.user import UserProfileResponse
from app.controllers.auth_controller import AuthController
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/user", tags=["User Profile"])

@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Returns profile information for the currently authenticated user.
    Requires Bearer JWT token in Authorization header.
    """
    return await AuthController.get_profile(current_user["id"])