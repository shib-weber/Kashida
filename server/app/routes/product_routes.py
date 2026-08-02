from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.product import ProductCreate, ProductResponse
from app.controllers.product_controller import ProductController

from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from app.utils.cloudinary import upload_image_to_cloud
from app.database import db
from app.utils.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.post("/add")
async def add_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    image: UploadFile = File(...), 
    fabric: str = Form("Handcrafted Fine Fabric"),  # Optional with default
    stock_quantity: int = Form(10), # Accepts the image file binary
    current_user: dict = Depends(get_current_user)
):
    try:
        # 1. Read binary bytes from uploaded file
        file_bytes = await image.read()
        
        # 2. Upload to Cloudinary CDN
        image_url = await upload_image_to_cloud(file_bytes)

        # 3. Construct product document and store URL in MongoDB
        product_doc = {
            "seller_id": current_user["id"],  # Tied to the seller
            "name": name,
            "category": category,
            "price": price,
            "description": description,
            "image": image_url,               # Cloudinary CDN URL string
            "created_at": datetime.utcnow()
        }

        result = await db.db.products.insert_one(product_doc)

        return {
            "message": "Product uploaded successfully",
            "product_id": str(result.inserted_id),
            "image_url": image_url
        }
    except Exception as e:
        print(f"❌ Product upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload product image")

@router.get("", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None):
    return await ProductController.get_all_products(category)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await ProductController.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse)
async def create_product(product: ProductCreate):
    return await ProductController.create_product(product)