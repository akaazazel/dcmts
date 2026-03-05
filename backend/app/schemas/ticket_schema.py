from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.constants.ticket_status import TicketStatus
from app.schemas.user_schema import UserResponse

class TicketBase(BaseModel):
    title: str
    description: str
    category: str
    priority: str

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None

class TicketAssign(BaseModel):
    assigned_to: str # Staff ObjectId string

class TicketStatusUpdate(BaseModel):
    status: TicketStatus

class BulkDeleteRequest(BaseModel):
    ticket_ids: List[str]

class TicketResponse(TicketBase):
    id: str
    ticket_id: str
    status: TicketStatus
    created_by: str
    assigned_to: Optional[str] = None
    user: Optional[UserResponse] = None
    assigned_staff: Optional[UserResponse] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
