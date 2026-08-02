from app.database import db
from bson import ObjectId
from datetime import datetime

class DashboardController:
    @staticmethod
    async def get_dashboard_data(user_id: str) -> dict:
        try:
            # 1. Fetch User Info
            user = await db.db.users.find_one({"_id": ObjectId(user_id)})
            user_name = user.get("name", "Valued Client") if user else "Valued Client"
            user_email = user.get("email", "") if user else ""

            # 2. Safely Calculate Active Cart Items from Redis
            active_cart_count = 0
            if db.redis:
                try:
                    cart_key = f"cart:{user_id}"
                    cart_items_raw = await db.redis.hgetall(cart_key)
                    active_cart_count = len(cart_items_raw)
                except Exception as redis_err:
                    print(f"⚠️ Redis connection failed, defaulting cart count to 0: {redis_err}")

            # 3. Fetch User Orders from MongoDB
            orders_cursor = db.db.orders.find({"user_id": user_id}).sort("created_at", -1)
            recent_orders = []
            async for doc in orders_cursor:
                created_at = doc.get("created_at")
                if isinstance(created_at, datetime):
                    date_str = created_at.strftime("%Y-%m-%d")
                elif isinstance(created_at, str):
                    date_str = created_at
                else:
                    date_str = "N/A"

                recent_orders.append({
                    "id": str(doc["_id"]),
                    "date": date_str,
                    "status": doc.get("status", "Processing"),
                    "total": f"${float(doc.get('total_amount', 0.0)):.2f}",
                    "items": doc.get("summary", "Custom Apparel Item")
                })

            # 4. Fetch Liked Items Count
            liked_count = await db.db.likes.count_documents({"user_id": user_id})

            return {
                "user": {
                    "name": user_name,
                    "email": user_email
                },
                "stats": {
                    "totalOrders": len(recent_orders),
                    "likedItems": liked_count,
                    "activeCart": active_cart_count
                },
                "recentOrders": recent_orders[:5]
            }
        except Exception as e:
            print(f"❌ Dashboard Controller Error: {e}")
            return {
                "user": {"name": "Valued Client", "email": ""},
                "stats": {"totalOrders": 0, "likedItems": 0, "activeCart": 0},
                "recentOrders": []
            }