from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Any
from app.schemas.ticket_schema import TicketResponse, TicketAssign, TicketStatusUpdate
from app.schemas.user_schema import UserResponse
from app.services.ticket_service import get_all_tickets, assign_ticket, update_ticket_status
from app.middleware.auth_middleware import get_current_active_user
from app.constants.roles import Role
from app.database import users_collection

router = APIRouter()

def require_admin(current_user: dict = Depends(get_current_active_user)) -> dict:
    if current_user.get("role") != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user

@router.get("/tickets", response_model=List[TicketResponse])
def read_all_tickets(current_user: dict = Depends(require_admin)) -> Any:
    return get_all_tickets()

@router.put("/tickets/{ticket_id}/assign")
def assign_ticket_to_staff(
    ticket_id: str,
    assignment: TicketAssign,
    current_user: dict = Depends(require_admin)
) -> Any:
    return assign_ticket(ticket_id, assignment.assigned_to)

@router.put("/tickets/{ticket_id}/status")
def change_ticket_status(
    ticket_id: str,
    status_update: TicketStatusUpdate,
    current_user: dict = Depends(require_admin)
) -> Any:
    return update_ticket_status(ticket_id, status_update.status)

@router.get("/users", response_model=List[UserResponse])
def get_all_users(current_user: dict = Depends(require_admin)) -> Any:
    users_cursor = users_collection.find()
    users = []
    for user in users_cursor:
        user["id"] = str(user["_id"])
        users.append(UserResponse(**user))
    return users
