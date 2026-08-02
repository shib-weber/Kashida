from fastapi import APIRouter, Depends, Body
from app.controllers.order_controller import OrderController
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("")
async def get_orders(current_user: dict = Depends(get_current_user)):
    return await OrderController.get_user_orders(current_user["id"])

@router.post("/checkout")
async def checkout(
    shipping_address: str = Body(default="", embed=True),
    current_user: dict = Depends(get_current_user)
):
    return await OrderController.create_order_from_cart(current_user["id"], shipping_address)