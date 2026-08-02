from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class ProductModel(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=3, max_length=150)
    category: str = Field(..., description="e.g. Kurtis, Lehengas, Sarees, Shawls, Dupattas")
    price: float = Field(..., gt=0)
    description: str
    fabric: str
    image: str  # Primary display thumbnail
    images: List[str] = Field(default_factory=list)  # Gallery image URLs
    sizes: List[str] = Field(default_factory=lambda: ["S", "M", "L", "XL"])
    tag: Optional[str] = None  # e.g., "Best Seller", "Heritage", "Limited Edition"
    stock_quantity: int = Field(default=10, ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "Zardozi Embroidered Silk Kurti",
                "category": "Kurtis",
                "price": 240.0,
                "description": "Crafted with pure Mulberry silk and gold threadwork.",
                "fabric": "100% Pure Mulberry Silk",
                "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
                "images": [
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb"
                ],
                "sizes": ["S", "M", "L", "XL"],
                "tag": "Best Seller",
                "stock_quantity": 25
            }
        }