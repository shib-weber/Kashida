from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_db, close_db
from app.routes import auth_routes, product_routes, cart_routes, user_routes,dashboard_routes,likes_routes,order_routes

# Define lifespan event for DB connections
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB and Redis
    await connect_to_db()
    yield
    # Shutdown: Close connections
    await close_db()

app = FastAPI(
    title="Kashida E-Commerce API",
    version="1.0.0",
    lifespan=lifespan  # Pass the lifespan context manager here
)

# CORS setup for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth_routes.router)
app.include_router(product_routes.router)
app.include_router(cart_routes.router)
app.include_router(user_routes.router)
app.include_router(dashboard_routes.router)
app.include_router(likes_routes.router)
app.include_router(order_routes.router)

@app.get("/")
async def root():
    return {"message": "Kashida E-Commerce Backend Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)