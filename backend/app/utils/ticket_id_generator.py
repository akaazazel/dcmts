from datetime import datetime
from app.database import db

def generate_ticket_id() -> str:
    """
    Generates a unique ticket ID like CMP-2026-0001
    """
    year = datetime.now().year

    # Use a MongoDB collection to keep track of a counter for the current year
    counters_collection = db["counters"]

    # We use find_one_and_update to atomically increment the sequence for the given year
    counter = counters_collection.find_one_and_update(
        {"_id": f"ticket_id_{year}"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=True # Returns the updated document
    )

    sequence_num = counter.get("sequence_value", 1)

    # Format: CMP-YYYY-XXXX (where XXXX is 0-padded sequence)
    return f"CMP-{year}-{sequence_num:04d}"
