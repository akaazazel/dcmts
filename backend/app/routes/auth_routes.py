from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, UserUpdate
from app.services.auth_service import register_user, authenticate_user, update_user_profile
from app.middleware.auth_middleware import get_current_user
from typing import Any

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate) -> Any:
    return register_user(user_data)

@router.post("/login")
def login(user_data: UserLogin) -> Any:
    return authenticate_user(user_data)

# Optional OAuth2 compatibility endpoint for Swagger UI
@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user_data = UserLogin(email=form_data.username, password=form_data.password)
    return authenticate_user(user_data)

@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: dict = Depends(get_current_user)) -> Any:
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
) -> Any:
    return update_user_profile(current_user["id"], update_data.model_dump())
