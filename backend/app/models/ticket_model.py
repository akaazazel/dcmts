from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from app.constants.ticket_status import TicketStatus

class TicketModel(BaseModel):
    ticket_id: str
    title: str
    description: str
    category: str
    priority: str
    status: TicketStatus = TicketStatus.OPEN
    created_by: str # User ObjectId string
    assigned_to: Optional[str] = None # Staff ObjectId string
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
