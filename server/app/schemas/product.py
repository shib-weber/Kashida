from pydantic import BaseModel, Field
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    fabric: Optional[str] = "100% Handcrafted Cotton & Silk"  # Default fallback
    image: str
    images: List[str] = []
    sizes: List[str] = ["S", "M", "L", "XL"]
    tag: Optional[str] = None
    stock_quantity: Optional[int] = 10                       # Default fallback

class ProductResponse(ProductCreate):
    id: str = Field(..., alias="_id")
    seller_id: Optional[str] = "public_guest"

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True