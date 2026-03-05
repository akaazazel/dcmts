from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from app.constants.roles import Role

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Role = Role.STUDENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: Role
    created_at: datetime

    class Config:
        populate_by_name = True
