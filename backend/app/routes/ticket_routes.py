from fastapi import APIRouter, Depends, status
from typing import List, Any
from app.schemas.ticket_schema import TicketCreate, TicketResponse
from app.services.ticket_service import create_ticket, get_user_tickets, get_ticket_by_id
from app.middleware.auth_middleware import get_current_active_user

router = APIRouter()

@router.post("/create", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_new_ticket(ticket_data: TicketCreate, current_user: dict = Depends(get_current_active_user)) -> Any:
    return create_ticket(ticket_data, str(current_user["_id"]))

@router.get("/my", response_model=List[TicketResponse])
def read_user_tickets(current_user: dict = Depends(get_current_active_user)) -> Any:
    return get_user_tickets(str(current_user["_id"]))

@router.get("/{ticket_id}", response_model=TicketResponse)
def read_ticket_by_id(ticket_id: str, current_user: dict = Depends(get_current_active_user)) -> Any:
    # Optional: ensure user is admin, staff, or the creator of the ticket
    return get_ticket_by_id(ticket_id)
