from app.database import db
from app.schemas.product import ProductCreate, ProductResponse
from bson import ObjectId
from typing import List, Optional

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
    async def get_product_by_id(product_id: str) -> dict:
        doc = await db.db.products.find_one({"_id": ObjectId(product_id)})
        if not doc:
            return None
        doc["id"] = str(doc.pop("_id"))
        return doc

    @staticmethod
    async def create_product(product_data: ProductCreate) -> dict:
        doc = product_data.model_dump()
        result = await db.db.products.insert_one(doc)
        doc["id"] = str(result.inserted_id)
        return doc