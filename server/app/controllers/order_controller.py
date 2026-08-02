from app.database import db
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from app.controllers.cart_controller import CartController

class OrderController:
    @staticmethod
    async def create_order_from_cart(user_id: str, shipping_address: str = "") -> dict:
        # Get active cart from Redis
        cart = await CartController.get_cart(user_id)
        if not cart["items"]:
            raise HTTPException(status_code=400, detail="Cannot place order with an empty cart")

        # Construct Order Document
        summary_item = cart["items"][0]["name"]
        if len(cart["items"]) > 1:
            summary_item += f" and {len(cart['items']) - 1} other item(s)"

        order_doc = {
            "user_id": user_id,
            "items": cart["items"],
            "total_amount": cart["subtotal"] + 15.0,  # Including express shipping
            "status": "Processing",
            "summary": summary_item,
            "shipping_address": shipping_address,
            "created_at": datetime.utcnow()
        }

        result = await db.db.orders.insert_one(order_doc)
        
        # Clear Redis cart after order is placed
        await CartController.clear_cart(user_id)

        order_doc["id"] = str(result.inserted_id)
        order_doc.pop("_id", None)
        return order_doc

    @staticmethod
    async def get_user_orders(user_id: str) -> list:
        cursor = db.db.orders.find({"user_id": user_id}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            orders.append({
                "id": str(doc["_id"]),
                "date": doc.get("created_at", datetime.utcnow()).strftime("%Y-%m-%d"),
                "status": doc.get("status", "Processing"),
                "total": f"${float(doc.get('total_amount', 0.0)):.2f}",
                "items": doc.get("summary", "Custom Apparel Item")
            })
        return orders