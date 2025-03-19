from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class CertificateBase(BaseModel):
    title: str
    description: Optional[str] = None
    
    class Config:
        orm_mode = True

class CertificateCreate(CertificateBase):
    course_id: str
    
    class Config:
        orm_mode = True

class Certificate(CertificateBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course_id: PyObjectId
    template: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class StudentCertificate(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    certificate_id: PyObjectId
    student_id: PyObjectId
    course_id: PyObjectId
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    completion_date: datetime
    credential_id: str
    certificate_url: Optional[str] = None
    status: str = "Available"  # Available, Pending
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

