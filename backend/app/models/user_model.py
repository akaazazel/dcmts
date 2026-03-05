from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
from app.constants.roles import Role

class UserModel(BaseModel):
    name: str
    email: EmailStr
    password_hash: str
    role: Role = Role.STUDENT
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
