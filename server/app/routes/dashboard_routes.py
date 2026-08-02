from fastapi import APIRouter, Depends
from app.controllers.dashboard_controller import DashboardController
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    """
    Returns personalized user dashboard statistics, active cart counts, and order history.
    """
    return await DashboardController.get_dashboard_data(current_user["id"])