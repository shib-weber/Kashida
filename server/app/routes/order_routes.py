from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.schemas.order import BuyNowRequest, OrderStatusUpdate, OrderResponse
from app.controllers.order_controller import OrderController
from app.utils.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# ==========================================
# CLIENT ROUTES
# ==========================================

@router.post("/buy-now", response_model=OrderResponse)
async def buy_now(
    payload: BuyNowRequest, 
    current_user: dict = Depends(get_current_user)
):
    """Directly places an order for a single garment."""
    return await OrderController.place_buy_now_order(current_user, payload)

@router.get("/my-orders", response_model=List[OrderResponse])
async def get_my_orders(current_user: dict = Depends(get_current_user)):
    """Fetches all orders placed by the current user."""
    return await OrderController.get_user_orders(current_user["id"])

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: str, 
    current_user: dict = Depends(get_current_user)
):
    """Cancels an order if it hasn't been shipped yet."""
    return await OrderController.cancel_order(order_id, current_user["id"])

@router.post("/{order_id}/return")
async def request_return(
    order_id: str,
    reason: str = Query(..., description="Reason for return"),
    current_user: dict = Depends(get_current_user)
):
    """Submits a return request within the 7-day post-delivery window."""
    return await OrderController.request_return(order_id, current_user["id"], reason)


# ==========================================
# ADMIN ROUTES (role == 'admin')
# ==========================================

@router.get("/admin/all", response_model=List[OrderResponse])
async def get_all_orders_admin(
    status: Optional[str] = Query(None, description="Filter by status e.g. Delivered, Processing"),
    admin_user: dict = Depends(get_current_admin_user)
):
    """Fetches all orders across the store with optional status filtering."""
    return await OrderController.get_all_orders_admin(status)

@router.put("/admin/{order_id}/status")
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    admin_user: dict = Depends(get_current_admin_user)
):
    """Updates order fulfillment status (Placed -> Processing -> Shipped -> Delivered)."""
    return await OrderController.update_order_status(order_id, payload)

@router.get("/admin/analytics")
async def get_order_analytics(admin_user: dict = Depends(get_current_admin_user)):
    """Provides revenue metrics, order counts, and return ratios."""
    return await OrderController.get_admin_analytics()