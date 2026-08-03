from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.controllers.product_controller import ProductController
from app.database import db
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.utils.auth import get_current_admin_user  # 🔒 Enforces RBAC (role == 'admin')
from app.utils.cloudinary import upload_image_to_cloud

router = APIRouter(prefix="/api/products", tags=["Products"])

# ==========================================
# PUBLIC ROUTES (Accessible by Customers & Guests)
# ==========================================

@router.get("", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None):
    return await ProductController.get_all_products(category)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await ProductController.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found"
        )
    return product


# ==========================================
# RESTRICTED ADMIN ROUTES (role == 'admin' Required)
# ==========================================

@router.post("/admin/add")
async def add_product(
    name: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    description: str = Form(...),
    fabric: str = Form("100% Handcrafted Fine Fabric"),
    tag: Optional[str] = Form(None),  # e.g., "Sold Out", "Best Seller", "Heritage", "Limited Edition"
    stock_quantity: int = Form(10),
    image: UploadFile = File(...),
    admin_user: dict = Depends(get_current_admin_user)  # 🔒 Rejects non-admin users with 403
):
    try:
        # 1. Read binary bytes from uploaded file
        file_bytes = await image.read()
        
        # 2. Upload to Cloudinary CDN
        image_url = await upload_image_to_cloud(file_bytes)

        # 3. Construct product document tied to admin seller_id
        product_doc = {
            "seller_id": admin_user["id"],
            "name": name,
            "category": category,
            "price": price,
            "description": description,
            "fabric": fabric,
            "tag": tag,
            "stock_quantity": stock_quantity,
            "image": image_url,
            "images": [image_url],
            "sizes": ["S", "M", "L", "XL"],
            "created_at": datetime.utcnow()
        }

        result = await db.db.products.insert_one(product_doc)

        return {
            "message": "Product published successfully",
            "product_id": str(result.inserted_id),
            "image_url": image_url
        }
    except Exception as e:
        print(f"❌ Product upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload product image"
        )

@router.put("/admin/{product_id}")
async def update_product(
    product_id: str,
    update_payload: ProductUpdate,
    admin_user: dict = Depends(get_current_admin_user)  # 🔒 Admin protected
):
    res = await ProductController.update_product(
        product_id, 
        admin_user["id"], 
        update_payload.model_dump(exclude_unset=True)
    )
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found or you don't have permission to modify it"
        )
    return res

@router.delete("/admin/{product_id}")
async def delete_product(
    product_id: str,
    admin_user: dict = Depends(get_current_admin_user)  # 🔒 Admin protected
):
    success = await ProductController.delete_product(product_id, admin_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Product not found or you don't have permission to delete it"
        )
    return {"message": "Product deleted successfully"}

@router.post("", response_model=ProductResponse)
async def create_product(
    product: ProductCreate, 
    admin_user: dict = Depends(get_current_admin_user)
):
    return await ProductController.create_product(product, admin_user["id"])