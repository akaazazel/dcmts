from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime, timezone
from app.database import tickets_collection
from app.models.ticket_model import TicketModel
from app.schemas.ticket_schema import TicketCreate, TicketUpdate, TicketResponse
from app.utils.ticket_id_generator import generate_ticket_id
from app.constants.ticket_status import TicketStatus
from bson import ObjectId

def create_ticket(ticket_data: TicketCreate, user_id: str) -> TicketResponse:
    ticket_id_str = generate_ticket_id()

    ticket_model = TicketModel(
        ticket_id=ticket_id_str,
        title=ticket_data.title,
        description=ticket_data.description,
        category=ticket_data.category,
        priority=ticket_data.priority,
        status=TicketStatus.OPEN,
        created_by=user_id
    )

    ticket_dict = ticket_model.model_dump()
    result = tickets_collection.insert_one(ticket_dict)

    return get_ticket_by_id(str(result.inserted_id))

def get_user_tickets(user_id: str) -> List[TicketResponse]:
    tickets_cursor = tickets_collection.find({"created_by": user_id}).sort("created_at", -1)
    return [map_ticket_to_response(ticket) for ticket in tickets_cursor]

def get_ticket_by_id(ticket_obj_id: str) -> TicketResponse:
    try:
        ticket = tickets_collection.find_one({"_id": ObjectId(ticket_obj_id)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket format")

    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return map_ticket_to_response(ticket)

def map_ticket_to_response(ticket: dict) -> TicketResponse:
    from app.database import users_collection
    from app.schemas.user_schema import UserResponse

    ticket["id"] = str(ticket["_id"])

    # Resolve creator info
    creator = users_collection.find_one({"_id": ObjectId(ticket["created_by"])})
    if creator:
        creator["id"] = str(creator["_id"])
        ticket["user"] = UserResponse(**creator)

    # Resolve assigned staff info
    if ticket.get("assigned_to"):
        staff = users_collection.find_one({"_id": ObjectId(ticket["assigned_to"])})
        if staff:
            staff["id"] = str(staff["_id"])
            ticket["assigned_staff"] = UserResponse(**staff)

    return TicketResponse(**ticket)

def delete_ticket_by_id(ticket_obj_id: str) -> dict:
    try:
        result = tickets_collection.delete_one({"_id": ObjectId(ticket_obj_id)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket format")

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return {"message": "Ticket deleted successfully"}

def get_all_tickets() -> List[TicketResponse]:
    tickets_cursor = tickets_collection.find().sort("created_at", -1)
    return [map_ticket_to_response(ticket) for ticket in tickets_cursor]

def assign_ticket(ticket_obj_id: str, staff_id: str) -> dict:
    result = tickets_collection.update_one(
        {"_id": ObjectId(ticket_obj_id)},
        {"$set": {
            "assigned_to": staff_id,
            "status": TicketStatus.ASSIGNED,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return {"message": "Ticket assigned successfully"}

def update_ticket_status(ticket_obj_id: str, new_status: TicketStatus) -> dict:
    result = tickets_collection.update_one(
        {"_id": ObjectId(ticket_obj_id)},
        {"$set": {
            "status": new_status,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return {"message": f"Ticket status updated to {new_status}"}

def get_staff_tickets(staff_id: str) -> List[TicketResponse]:
    tickets_cursor = tickets_collection.find({"assigned_to": staff_id}).sort("created_at", -1)
    return [map_ticket_to_response(ticket) for ticket in tickets_cursor]

def delete_multiple_tickets(ticket_ids: List[str]) -> dict:
    try:
        object_ids = [ObjectId(tid) for tid in ticket_ids]
        result = tickets_collection.delete_many({"_id": {"$in": object_ids}})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ticket IDs")

    return {"message": f"{result.deleted_count} tickets deleted successfully"}
