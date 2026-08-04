from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class OrderItemSchema(BaseModel):
    product_id: str
    product_name: str
    image: str
    price: float
    quantity: int = 1
    size: str = "M"

# Client "Buy Now" Request Payload
class BuyNowRequest(BaseModel):
    product_id: str
    quantity: int = 1
    size: str = "M"
    shipping_address: str
    phone: str
    payment_method: str = "COD"  # "COD" or "Prepaid"

# Admin Status Update Request Payload
class OrderStatusUpdate(BaseModel):
    status: str  # Options: "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"
    tracking_number: Optional[str] = None
    note: Optional[str] = None

class OrderResponse(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    customer_name: str
    customer_email: str
    items: List[OrderItemSchema]
    total_amount: float
    shipping_address: str
    phone: str
    payment_method: str
    payment_status: str
    order_status: str  # "Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Return Requested", "Returned"
    status_history: List[dict]
    created_at: datetime
    updated_at: datetime
    
    # Return window metadata
    delivered_at: Optional[datetime] = None
    return_eligible_until: Optional[datetime] = None
    return_reason: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )