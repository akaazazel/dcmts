from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError
from app.database import users_collection
from app.models.user_model import UserModel
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.utils.password_utils import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from bson import ObjectId

def register_user(user_data: UserCreate) -> UserResponse:
    # Check if user already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_pwd = hash_password(user_data.password)
    user_model = UserModel(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pwd,
        role=user_data.role
    )

    user_dict = user_model.model_dump()
    result = users_collection.insert_one(user_dict)

    # Return UserResponse
    return UserResponse(
        id=str(result.inserted_id),
        name=user_model.name,
        email=user_model.email,
        role=user_model.role,
        created_at=user_model.created_at
    )

def authenticate_user(user_data: UserLogin) -> dict:
    user = users_collection.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Create access token
    token = create_access_token(data={"sub": str(user["_id"]), "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}
