from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str  # assignment, material, announcement, grade, feedback
    
    class Config:
        orm_mode = True

class NotificationCreate(NotificationBase):
    recipient_id: str
    course_id: Optional[str] = None
    
    class Config:
        orm_mode = True

class Notification(NotificationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    recipient_id: PyObjectId
    sender_id: Optional[PyObjectId] = None
    course_id: Optional[PyObjectId] = None
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

