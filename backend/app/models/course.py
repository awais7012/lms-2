from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from bson import ObjectId
from app.models.common import PyObjectId

class CourseBase(BaseModel):
    courseName: str
    courseCode: str
    description: str
    category: str
    duration: int  # in weeks
    price: float
    maxStudents: int
    difficulty: str = "beginner"  # beginner, intermediate, advanced
    instructorName: str
    
    class Config:
        orm_mode = True

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    courseName: Optional[str] = None
    courseCode: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[float] = None
    maxStudents: Optional[int] = None
    difficulty: Optional[str] = None
    instructorName: Optional[str] = None
    
    class Config:
        orm_mode = True

class Course(CourseBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    teacher_id: PyObjectId
    thumbnail: Optional[str] = None
    enrollmentStatus: str = "Open"  # Open, Closed, Full
    studentsEnrolled: int = 0
    hasModules: bool = False
    hasQuizzes: bool = False
    certificateOffered: bool = False
    certificateTitle: Optional[str] = None
    certificateDescription: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class Module(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course_id: PyObjectId
    title: str
    description: Optional[str] = None
    order: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class Lesson(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    module_id: PyObjectId
    title: str
    description: Optional[str] = None
    duration: str
    materialType: Optional[str] = None  # video, pdf, link, none
    materialUrl: Optional[str] = None
    materialFile: Optional[str] = None
    order: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

class Enrollment(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    course_id: PyObjectId
    student_id: PyObjectId
    enrollment_date: datetime = Field(default_factory=datetime.utcnow)
    progress: int = 0
    status: str = "Active"  # Active, Completed, Dropped
    
    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str
        }

