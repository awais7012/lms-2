from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User, UserUpdate
from app.api.deps import get_current_user, get_current_superuser
from app.core.security import get_password_hash
from app.db.mongodb import db
from bson import ObjectId
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/me", response_model=dict)
async def read_current_user(current_user: User = Depends(get_current_user)) -> Any:
    """
    Get current user.
    """
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "is_superuser": current_user.is_superuser
    }

@router.put("/me", response_model=dict)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Update current user.
    """
    update_data = user_update.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(current_user.id)})
    
    return {
        "message": "User updated successfully",
        "user": {
            "id": str(updated_user["_id"]),
            "email": updated_user["email"],
            "username": updated_user["username"],
            "role": updated_user["role"],
            "is_active": updated_user["is_active"]
        }
    }

@router.get("/", response_model=dict)
async def read_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Get all users (admin only).
    """
    query = {}
    if role:
        query["role"] = role
    
    users = []
    cursor = db.users.find(query).skip(skip).limit(limit)
    
    async for user in cursor:
        users.append({
            "id": str(user["_id"]),
            "email": user["email"],
            "username": user["username"],
            "role": user["role"],
            "is_active": user["is_active"],
            "is_superuser": user.get("is_superuser", False)
        })
    
    total = await db.users.count_documents(query)
    
    return {
        "total": total,
        "users": users
    }

@router.get("/{user_id}", response_model=dict)
async def read_user(
    user_id: str,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Get user by ID (admin only).
    """
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "role": user["role"],
        "is_active": user["is_active"],
        "is_superuser": user.get("is_superuser", False)
    }

@router.put("/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Update user by ID (admin only).
    """
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_update.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    return {
        "message": "User updated successfully",
        "user": {
            "id": str(updated_user["_id"]),
            "email": updated_user["email"],
            "username": updated_user["username"],
            "role": updated_user["role"],
            "is_active": updated_user["is_active"]
        }
    }

@router.delete("/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_superuser)
) -> Any:
    """
    Delete user by ID (admin only).
    """
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await db.users.delete_one({"_id": ObjectId(user_id)})
    
    return {"message": "User deleted successfully"}