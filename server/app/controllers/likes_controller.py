from app.database import db
from bson import ObjectId
from fastapi import HTTPException
from app.controllers.product_controller import ProductController

class LikesController:
    @staticmethod
    async def get_user_likes(user_id: str) -> list:
        liked_products = []
        try:
            cursor = db.db.likes.find({"user_id": user_id})
            async for doc in cursor:
                try:
                    product = await ProductController.get_product_by_id(doc["product_id"])
                    if product:
                        liked_products.append(product)
                except Exception as prod_err:
                    print(f"⚠️ Failed to fetch product {doc.get('product_id')}: {prod_err}")
                    continue
        except Exception as db_err:
            print(f"⚠️ Database offline or error fetching user likes: {db_err}")
            # Returns an empty list instead of crashing with 500
            return []

        return liked_products

    @staticmethod
    async def toggle_like(user_id: str, product_id: str) -> dict:
        try:
            existing = await db.db.likes.find_one({"user_id": user_id, "product_id": product_id})
            if existing:
                await db.db.likes.delete_one({"_id": existing["_id"]})
                return {"message": "Removed from wishlist", "liked": False}
            else:
                await db.db.likes.insert_one({"user_id": user_id, "product_id": product_id})
                return {"message": "Added to wishlist", "liked": True}
        except Exception as db_err:
            print(f"⚠️ Error toggling like for user {user_id}: {db_err}")
            raise HTTPException(
                status_code=503, 
                detail="Wishlist service temporarily unavailable"
            )

    @staticmethod
    async def remove_like(user_id: str, product_id: str) -> dict:
        try:
            await db.db.likes.delete_one({"user_id": user_id, "product_id": product_id})
            return {"message": "Removed from wishlist"}
        except Exception as db_err:
            print(f"⚠️ Error removing like for product {product_id}: {db_err}")
            return {"message": "Failed to remove item, service offline"}