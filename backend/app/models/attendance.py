from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime, date
from bson import ObjectId
from app.models.common import PyObjectId

class AttendanceRecord(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course_id: PyObjectId
    student_id: PyObjectId
    date: date
    status: str  # Present, Absent, Late, Excused
    time: Optional[str] = None
    note: Optional[str] = None
    recorded_by: PyObjectId  # teacher_id
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class AttendanceCreate(BaseModel):
    course_id: str
    student_id: str
    date: date
    status: str
    time: Optional[str] = None
    note: Optional[str] = None
    
    class Config:
        orm_mode = True

class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
    time: Optional[str] = None
    note: Optional[str] = None
    
    class Config:
        orm_mode = True

class AttendanceBulkCreate(BaseModel):
    course_id: str
    date: date
    records: List[dict]  # List of {student_id, status, time, note}
    
    class Config:
        orm_mode = True

