from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class UserBase(BaseModel):
    email: EmailStr
    username: str
    role: str = "student"  # student, teacher, admin
    is_active: bool = True
    
    class Config:
        orm_mode = True

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    
    class Config:
        orm_mode = True

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class UserInDB(User):
    hashed_password: str

class UserProfile(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    full_name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class TeacherProfile(UserProfile):
    department: Optional[str] = None
    position: Optional[str] = None
    office: Optional[str] = None
    
    class Config:
        orm_mode = True

class StudentProfile(UserProfile):
    enrollment_date: Optional[datetime] = None
    student_id: Optional[str] = None
    
    class Config:
        orm_mode = True

