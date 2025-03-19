from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: datetime
    
    class Config:
        orm_mode = True

class AssignmentCreate(AssignmentBase):
    courseId: str
    courseName: str

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class Assignment(AssignmentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course: PyObjectId
    courseName: str
    teacher_id: PyObjectId
    attachmentFile: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class AssignmentSubmission(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    assignment_id: PyObjectId
    student_id: PyObjectId
    submission_file: Optional[str] = None
    submission_text: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "Submitted"  # Submitted, Graded, Late
    score: Optional[float] = None
    feedback: Optional[str] = None
    graded_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

