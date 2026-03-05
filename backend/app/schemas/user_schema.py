from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from app.constants.roles import Role

class UserBase(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None
    department: Optional[str] = None
    semester: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role: Role = Role.STUDENT

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    department: Optional[str] = None
    semester: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: Role
    created_at: datetime

    class Config:
        populate_by_name = True
