from datetime import timedelta,datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Body, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash
)
from app.db.mongodb import db
from app.models.user import User, UserCreate
from app.utils.email import send_reset_password_email, send_verification_email
from app.api.deps import get_current_user
from bson import ObjectId
import random
import string
import logging
from jose import JWTError, jwt
from pydantic import ValidationError,BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/signup")
async def signup(user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    # Check if user with this email exists
    user = await db.users.find_one({"email": user_in.email})
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create new user
    user_data = user_in.dict()
    hashed_password = get_password_hash(user_data.pop("password"))
    
    new_user = {
        "email": user_data["email"],
        "username": user_data["username"],
        "role": user_data["role"],
        "hashed_password": hashed_password,
        "is_active": True,
        "is_superuser": False
    }
    
    result = await db.users.insert_one(new_user)
    
    # Create user profile based on role
    profile_data = {
        "user_id": result.inserted_id,
        "full_name": user_data["username"]
    }
    
    if user_data["role"] == "student":
        await db.student_profiles.insert_one(profile_data)
    elif user_data["role"] == "teacher":
        await db.teacher_profiles.insert_one(profile_data)
    
    # Send verification email
    # await send_verification_email(user_data["email"])
    
    return {"message": "User created successfully"}

@router.post("/login")
async def login(response: Response,form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    # print(form_data.dict())
    # Find user by email
    user = await db.users.find_one({"email": form_data.username})
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access and refresh tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user["_id"]), expires_delta=access_token_expires
    )
    
    refresh_token = create_refresh_token(subject=str(user["_id"]))
    
    # Set refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    
    # Return user data and access token
    user_data = {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"],
        "role": user["role"]
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_data,
        "role":user["role"],
        "is_superuser": user["is_superuser"]
    }

@router.post("/refresh-token")
async def refresh_token(
    response: Response,
    refresh_token: str = Cookie(None)
) -> Any:
    """
    Refresh access token.
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        token_type = payload.get("type")
        if token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (JWTError, ValidationError) as e:
        logger.error(f"Token validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user_id, expires_delta=access_token_expires
    )
    
    # Create new refresh token
    new_refresh_token = create_refresh_token(subject=user_id)
    
    # Set new refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(response: Response) -> Any:
    """
    Logout user by clearing refresh token cookie.
    """
    response.delete_cookie(key="refresh_token")
    return {"message": "Successfully logged out"}

from pydantic import BaseModel

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest) -> Any:
    email = data.email
    user = await db.users.find_one({"email": email})
    if not user:
        # Don't reveal that the user doesn't exist
        return {"message": "If your email is registered, you will receive a password reset link"}
    
    # Generate OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Store OTP in database with expiration
    await db.password_reset.insert_one({
        "email": email,
        "otp": otp,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(minutes=15)
    })
    
    # Send email with OTP
    await send_reset_password_email(email=email, otp=otp)
    
    return {"message": "If your email is registered, you will receive a password reset link"}

@router.post("/verify-otp")
async def verify_otp(email: str = Body(...), otp: str = Body(...)) -> Any:
    """
    Verify OTP for password reset.
    """
    # Find OTP in database
    reset_record = await db.password_reset.find_one({
        "email": email,
        "otp": otp,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reset_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Mark OTP as verified
    await db.password_reset.update_one(
        {"_id": reset_record["_id"]},
        {"$set": {"verified": True}}
    )
    
    return {"message": "OTP verified successfully"}

@router.post("/reset-password")
async def reset_password(email: str = Body(...), password: str = Body(...)) -> Any:
    """
    Reset password after OTP verification.
    """
    # Check if OTP was verified
    reset_record = await db.password_reset.find_one({
        "email": email,
        "verified": True,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not reset_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP not verified or expired"
        )
    
    # Update user password
    hashed_password = get_password_hash(password)
    await db.users.update_one(
        {"email": email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    # Delete reset record
    await db.password_reset.delete_one({"_id": reset_record["_id"]})
    
    return {"message": "Password reset successfully"}

