from fastapi import APIRouter, Depends
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse
from app.controllers.cart_controller import CartController
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user)):
    return await CartController.get_cart(current_user["id"])

@router.post("/item", response_model=CartResponse)
async def add_to_cart(item: CartItemAdd, current_user: dict = Depends(get_current_user)):
    return await CartController.add_item(
        user_id=current_user["id"],
        product_id=item.productId,
        quantity=item.quantity,
        size=item.size
    )

@router.patch("/item", response_model=CartResponse)
async def update_cart_item(item: CartItemUpdate, current_user: dict = Depends(get_current_user)):
    return await CartController.update_quantity(
        user_id=current_user["id"],
        product_id=item.productId,
        delta=item.delta
    )

@router.delete("/item/{product_id}", response_model=CartResponse)
async def remove_from_cart(product_id: str, current_user: dict = Depends(get_current_user)):
    return await CartController.remove_item(current_user["id"], product_id)

@router.delete("")
async def clear_cart(current_user: dict = Depends(get_current_user)):
    return await CartController.clear_cart(current_user["id"])