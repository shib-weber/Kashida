import json
from app.database import db
from app.controllers.product_controller import ProductController
from fastapi import HTTPException

# In-memory fallback dictionary for when local Redis is offline
# Structure: { "user_id": { "product_id": { ...item_data... } } }
_MEMORY_CARTS: dict[str, dict] = {}

class CartController:
    @staticmethod
    def _cart_key(user_id: str) -> str:
        return f"cart:{user_id}"

    @classmethod
    async def get_cart(cls, user_id: str) -> dict:
        key = cls._cart_key(user_id)
        items = []
        subtotal = 0.0

        # 1. Try Redis first
        if db.redis:
            try:
                raw_items = await db.redis.hgetall(key)
                for prod_id, item_json in raw_items.items():
                    item = json.loads(item_json)
                    subtotal += item["price"] * item["quantity"]
                    items.append(item)
                return {"items": items, "subtotal": round(subtotal, 2)}
            except Exception as redis_err:
                print(f"⚠️ Redis offline, reading from in-memory fallback...")

        # 2. In-Memory Fallback
        user_memory_cart = _MEMORY_CARTS.get(user_id, {})
        for prod_id, item in user_memory_cart.items():
            subtotal += item["price"] * item["quantity"]
            items.append(item)

        return {"items": items, "subtotal": round(subtotal, 2)}

    @classmethod
    async def add_item(cls, user_id: str, product_id: str, quantity: int, size: str) -> dict:
        product = await ProductController.get_product_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        key = cls._cart_key(user_id)
        
        # 1. Try Redis first
        if db.redis:
            try:
                existing_item_json = await db.redis.hget(key, product_id)
                if existing_item_json:
                    item = json.loads(existing_item_json)
                    item["quantity"] += quantity
                else:
                    item = {
                        "productId": product_id,
                        "name": product["name"],
                        "price": float(product["price"]),
                        "quantity": quantity,
                        "size": size,
                        "image": product.get("image", "")
                    }

                await db.redis.hset(key, product_id, json.dumps(item))
                await db.redis.expire(key, 2592000)  # 30-day TTL
                return await cls.get_cart(user_id)
            except Exception as redis_err:
                print(f"⚠️ Redis write error, falling back to in-memory store...")

        # 2. In-Memory Fallback Write
        if user_id not in _MEMORY_CARTS:
            _MEMORY_CARTS[user_id] = {}

        if product_id in _MEMORY_CARTS[user_id]:
            _MEMORY_CARTS[user_id][product_id]["quantity"] += quantity
        else:
            _MEMORY_CARTS[user_id][product_id] = {
                "productId": product_id,
                "name": product["name"],
                "price": float(product["price"]),
                "quantity": quantity,
                "size": size,
                "image": product.get("image", "")
            }

        return await cls.get_cart(user_id)

    @classmethod
    async def update_quantity(cls, user_id: str, product_id: str, delta: int) -> dict:
        key = cls._cart_key(user_id)

        # 1. Try Redis
        if db.redis:
            try:
                existing_json = await db.redis.hget(key, product_id)
                if existing_json:
                    item = json.loads(existing_json)
                    item["quantity"] += delta
                    if item["quantity"] <= 0:
                        await db.redis.hdel(key, product_id)
                    else:
                        await db.redis.hset(key, product_id, json.dumps(item))
                    return await cls.get_cart(user_id)
            except Exception:
                pass

        # 2. In-Memory Fallback
        if user_id in _MEMORY_CARTS and product_id in _MEMORY_CARTS[user_id]:
            _MEMORY_CARTS[user_id][product_id]["quantity"] += delta
            if _MEMORY_CARTS[user_id][product_id]["quantity"] <= 0:
                del _MEMORY_CARTS[user_id][product_id]

        return await cls.get_cart(user_id)

    @classmethod
    async def remove_item(cls, user_id: str, product_id: str) -> dict:
        key = cls._cart_key(user_id)

        # 1. Try Redis
        if db.redis:
            try:
                await db.redis.hdel(key, product_id)
            except Exception:
                pass

        # 2. In-Memory Fallback
        if user_id in _MEMORY_CARTS and product_id in _MEMORY_CARTS[user_id]:
            del _MEMORY_CARTS[user_id][product_id]

        return await cls.get_cart(user_id)

    @classmethod
    async def clear_cart(cls, user_id: str):
        key = cls._cart_key(user_id)

        if db.redis:
            try:
                await db.redis.delete(key)
            except Exception:
                pass

        _MEMORY_CARTS[user_id] = {}
        return {"message": "Cart cleared successfully"}