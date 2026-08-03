from app.database import db
from app.schemas.product import ProductCreate
from bson import ObjectId
from typing import List, Optional, Dict, Any

class ProductController:
    @staticmethod
    async def get_all_products(category: Optional[str] = None) -> list:
        query = {}
        if category:
            query["category"] = category
            
        cursor = db.db.products.find(query)
        products = []
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])  # Convert Mongo ObjectId to string
            products.append(doc)
            
        return products

    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[dict]:
        try:
            doc = await db.db.products.find_one({"_id": ObjectId(product_id)})
            if not doc:
                return None
            doc["_id"] = str(doc["_id"])
            return doc
        except Exception:
            return None

    @staticmethod
    async def create_product(product_data: ProductCreate, seller_id: Optional[str] = None) -> dict:
        doc = product_data.model_dump()
        if seller_id:
            doc["seller_id"] = seller_id
            
        result = await db.db.products.insert_one(doc)
        doc["_id"] = str(result.inserted_id)
        return doc

    @staticmethod
    async def update_product(product_id: str, seller_id: str, update_data: dict) -> Optional[dict]:
        try:
            # Filter out None values to avoid overwriting existing MongoDB fields
            clean_data = {k: v for k, v in update_data.items() if v is not None}
            if not clean_data:
                return {"message": "No fields to update"}

            result = await db.db.products.update_one(
                {"_id": ObjectId(product_id), "seller_id": seller_id},
                {"$set": clean_data}
            )

            if result.matched_count == 0:
                return None
            return {"message": "Product updated successfully"}
        except Exception as e:
            print(f"❌ Error updating product: {e}")
            return None

    @staticmethod
    async def delete_product(product_id: str, seller_id: str) -> bool:
        try:
            result = await db.db.products.delete_one({
                "_id": ObjectId(product_id),
                "seller_id": seller_id
            })
            return result.deleted_count > 0
        except Exception as e:
            print(f"❌ Error deleting product: {e}")
            return False