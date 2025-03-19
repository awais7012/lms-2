from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class MaterialBase(BaseModel):
    title: str
    type: str  # document, video, link
    
    class Config:
        orm_mode = True

class MaterialCreate(MaterialBase):
    course_id: str
    module_id: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    
    class Config:
        orm_mode = True

class MaterialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    
    class Config:
        orm_mode = True

class Material(MaterialBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course_id: PyObjectId
    module_id: Optional[PyObjectId] = None
    description: Optional[str] = None
    file_path: Optional[str] = None
    url: Optional[str] = None
    format: Optional[str] = None  # PDF, MP4, etc.
    size: Optional[str] = None
    duration: Optional[str] = None  # For videos
    uploaded_by: PyObjectId  # teacher_id
    access_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

