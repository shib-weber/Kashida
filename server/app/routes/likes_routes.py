from fastapi import APIRouter, Depends
from app.controllers.likes_controller import LikesController
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/likes", tags=["Wishlist / Likes"])

@router.get("")
async def get_likes(current_user: dict = Depends(get_current_user)):
    return await LikesController.get_user_likes(current_user["id"])

@router.post("/{product_id}")
async def toggle_like(product_id: str, current_user: dict = Depends(get_current_user)):
    return await LikesController.toggle_like(current_user["id"], product_id)

@router.delete("/{product_id}")
async def remove_like(product_id: str, current_user: dict = Depends(get_current_user)):
    return await LikesController.remove_like(current_user["id"], product_id)