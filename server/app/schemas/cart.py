from pydantic import BaseModel
from typing import List, Optional

class CartItemAdd(BaseModel):
    productId: str
    quantity: int = 1
    size: Optional[str] = "M"

class CartItemUpdate(BaseModel):
    productId: str
    delta: int

class CartItemResponse(BaseModel):
    productId: str
    name: str
    price: float
    quantity: int
    size: str
    image: str

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float