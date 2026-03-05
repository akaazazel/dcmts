from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from app.schemas.ticket_schema import TicketResponse, TicketStatusUpdate
from app.services.ticket_service import get_staff_tickets, update_ticket_status
from app.middleware.auth_middleware import get_current_active_user
from app.constants.roles import Role

router = APIRouter()

def require_staff_or_admin(current_user: dict = Depends(get_current_active_user)) -> dict:
    if current_user.get("role") not in [Role.STAFF, Role.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user

@router.get("/tickets", response_model=List[TicketResponse])
def read_staff_tickets(current_user: dict = Depends(require_staff_or_admin)) -> Any:
    return get_staff_tickets(str(current_user["_id"]))

@router.put("/tickets/{ticket_id}/progress")
def update_ticket_progress(
    ticket_id: str,
    status_update: TicketStatusUpdate,
    current_user: dict = Depends(require_staff_or_admin)
) -> Any:
    return update_ticket_status(ticket_id, status_update.status)
