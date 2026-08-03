from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    description: str
    fabric: Optional[str] = "100% Handcrafted Cotton & Silk"
    image: str
    images: List[str] = []
    sizes: List[str] = ["S", "M", "L", "XL"]
    tag: Optional[str] = None  # e.g., "Sold Out", "Best Seller", "Heritage", "Limited Edition"
    stock_quantity: Optional[int] = 10

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    tag: Optional[str] = None
    stock_quantity: Optional[int] = None

class ProductResponse(ProductCreate):
    id: str = Field(..., alias="_id")
    seller_id: str

    # Updated for Pydantic v2 compatibility
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )