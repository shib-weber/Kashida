from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.controllers.auth_controller import AuthController
from app.utils.auth import get_current_admin_user  # Enforces role == "admin"

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# ==========================================
# PUBLIC CUSTOMER ROUTES
# ==========================================

@router.post("/register", response_model=TokenResponse)
async def register(user: UserCreate):
    return await AuthController.register(user)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    return await AuthController.login(credentials)


# ==========================================
# RESTRICTED ADMIN ROUTES
# ==========================================

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(credentials: UserLogin):
    """
    Authenticates admin users. Rejects requests if account role != 'admin'.
    """
    return await AuthController.admin_login(credentials)

@router.post("/admin/create-admin")
async def create_new_admin(
    new_admin_data: UserCreate,
    admin_user: dict = Depends(get_current_admin_user)  # 🔒 Only an active admin can call this
):
    """
    Allows an authenticated Admin to register secondary Admin accounts.
    """
    return await AuthController.create_admin(new_admin_data, created_by_id=admin_user["id"])