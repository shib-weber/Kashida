from app.database import db
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException, status

# 7-day return policy limit
RETURN_WINDOW_DAYS = 7

class OrderController:

    # ==========================================
    # CLIENT CONTROLLER METHODS
    # ==========================================

    @staticmethod
    async def place_buy_now_order(user: dict, payload) -> dict:
        # Fetch product details directly
        product = await db.db.products.find_one({"_id": ObjectId(payload.product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        total_price = float(product["price"]) * payload.quantity
        now = datetime.utcnow()

        initial_history_entry = {
            "status": "Placed",
            "timestamp": now.isoformat(),
            "note": "Order placed successfully via Direct Checkout."
        }

        order_doc = {
            "user_id": user["id"],
            "customer_name": user.get("name", "Valued Customer"),
            "customer_email": user["email"],
            "items": [{
                "product_id": str(product["_id"]),
                "product_name": product["name"],
                "image": product.get("image", ""),
                "price": float(product["price"]),
                "quantity": payload.quantity,
                "size": payload.size
            }],
            "total_amount": total_price,
            "shipping_address": payload.shipping_address,
            "phone": payload.phone,
            "payment_method": payload.payment_method,
            "payment_status": "Paid" if payload.payment_method == "Prepaid" else "Pending",
            "order_status": "Placed",
            "status_history": [initial_history_entry],
            "created_at": now,
            "updated_at": now,
            "delivered_at": None,
            "return_eligible_until": None,
            "return_reason": None
        }

        result = await db.db.orders.insert_one(order_doc)
        order_doc["_id"] = str(result.inserted_id)
        return order_doc

    @staticmethod
    async def get_user_orders(user_id: str) -> list:
        cursor = db.db.orders.find({"user_id": user_id}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            orders.append(doc)
        return orders

    @staticmethod
    async def cancel_order(order_id: str, user_id: str) -> dict:
        order = await db.db.orders.find_one({"_id": ObjectId(order_id), "user_id": user_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order["order_status"] in ["Shipped", "Out for Delivery", "Delivered", "Cancelled"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Cannot cancel order when status is '{order['order_status']}'."
            )

        now = datetime.utcnow()
        new_history = {
            "status": "Cancelled",
            "timestamp": now.isoformat(),
            "note": "Cancelled by customer."
        }

        await db.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {"order_status": "Cancelled", "updated_at": now},
                "$push": {"status_history": new_history}
            }
        )
        return {"message": "Order cancelled successfully"}

    @staticmethod
    async def request_return(order_id: str, user_id: str, reason: str) -> dict:
        order = await db.db.orders.find_one({"_id": ObjectId(order_id), "user_id": user_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order["order_status"] != "Delivered":
            raise HTTPException(status_code=400, detail="Return option is only available for delivered orders.")

        now = datetime.utcnow()
        if not order.get("return_eligible_until") or now > order["return_eligible_until"]:
            raise HTTPException(status_code=400, detail="Return policy window (7 days) has expired for this order.")

        new_history = {
            "status": "Return Requested",
            "timestamp": now.isoformat(),
            "note": f"Reason: {reason}"
        }

        await db.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "order_status": "Return Requested",
                    "return_reason": reason,
                    "updated_at": now
                },
                "$push": {"status_history": new_history}
            }
        )
        return {"message": "Return request submitted successfully. Our team will review it."}


    # ==========================================
    # ADMIN CONTROLLER METHODS
    # ==========================================

    @staticmethod
    async def get_all_orders_admin(status_filter: str = None) -> list:
        query = {"order_status": status_filter} if status_filter else {}
        cursor = db.db.orders.find(query).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            orders.append(doc)
        return orders

    @staticmethod
    async def update_order_status(order_id: str, payload) -> dict:
        now = datetime.utcnow()
        order = await db.db.orders.find_one({"_id": ObjectId(order_id)})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        update_fields = {
            "order_status": payload.status,
            "updated_at": now
        }

        # If marking as Delivered, set the 7-day Return Eligibility window
        if payload.status == "Delivered":
            update_fields["delivered_at"] = now
            update_fields["return_eligible_until"] = now + timedelta(days=RETURN_WINDOW_DAYS)
            update_fields["payment_status"] = "Paid"

        new_history = {
            "status": payload.status,
            "timestamp": now.isoformat(),
            "note": payload.note or f"Order updated to {payload.status} by merchant."
        }

        await db.db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": update_fields,
                "$push": {"status_history": new_history}
            }
        )
        return {"message": f"Order status updated to '{payload.status}' successfully."}

    @staticmethod
    async def get_admin_analytics() -> dict:
        # Aggregate total revenue & delivered orders
        pipeline = [
            {"$match": {"order_status": {"$ne": "Cancelled"}}},
            {
                "$group": {
                    "_id": None,
                    "total_revenue": {"$sum": "$total_amount"},
                    "total_orders": {"$sum": 1}
                }
            }
        ]
        agg_res = await db.db.orders.aggregate(pipeline).to_list(length=1)
        
        revenue = agg_res[0]["total_revenue"] if agg_res else 0.0
        total_orders = agg_res[0]["total_orders"] if agg_res else 0

        # Status breakdowns
        delivered_count = await db.db.orders.count_documents({"order_status": "Delivered"})
        pending_count = await db.db.orders.count_documents({"order_status": {"$in": ["Placed", "Processing"]}})
        return_count = await db.db.orders.count_documents({"order_status": "Return Requested"})

        return {
            "total_revenue": revenue,
            "total_orders": total_orders,
            "delivered_orders": delivered_count,
            "pending_orders": pending_count,
            "returns_requested": return_count
        }