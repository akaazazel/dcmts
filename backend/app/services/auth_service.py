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
    user_dict = user_data.model_dump()
    del user_dict["password"]
    user_dict["password_hash"] = hashed_pwd

    user_model = UserModel(**user_dict)

    result = users_collection.insert_one(user_model.model_dump())
    user_id = str(result.inserted_id)

    # Return UserResponse
    return UserResponse(
        id=user_id,
        **user_model.model_dump()
    )

def update_user_profile(user_id: str, update_data: dict) -> UserResponse:
    # Filter out None values and disallowed fields
    allowed_fields = ["name", "age", "department", "semester"]
    update_dict = {k: v for k, v in update_data.items() if k in allowed_fields and v is not None}

    if not update_dict:
        # Fetch current user to return
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        user["id"] = str(user["_id"])
        return UserResponse(**user)

    result = users_collection.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": update_dict},
        return_document=True
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    result["id"] = str(result["_id"])
    return UserResponse(**result)

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

def delete_user_by_id(user_id: str) -> dict:
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {"message": "User deleted successfully"}
