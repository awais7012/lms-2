from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models.user import User, UserProfile, TeacherProfile
from app.api.deps import get_current_teacher
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from bson import ObjectId
import logging
from datetime import datetime, timedelta

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/profile", response_model=dict)
async def get_teacher_profile(current_user: User = Depends(get_current_teacher)) -> Any:
    """
    Get current teacher's profile.
    """
    # Get teacher profile
    profile = await db.teacher_profiles.find_one({"user_id": ObjectId(current_user.id)})
    
    if not profile:
        # Create empty profile if it doesn't exist
        profile = {
            "user_id": ObjectId(current_user.id),
            "full_name": current_user.username,
            "bio": None,
            "profile_picture": None,
            "phone": None,
            "address": None,
            "department": None,
            "position": None,
            "office": None
        }
        
        await db.teacher_profiles.insert_one(profile)
    
    # Get courses data
    courses = []
    courses_cursor = db.courses.find({"teacher_id": ObjectId(current_user.id)})
    
    async for course in courses_cursor:
        # Get enrollment count
        enrollment_count = await db.enrollments.count_documents({
            "course_id": course["_id"]
        })
        
        courses.append({
            "course_id": str(course["_id"]),
            "course_name": course["courseName"],
            "course_code": course["courseCode"],
            "students_count": enrollment_count,
            "status": course["enrollmentStatus"]
        })
    
    # Format profile data
    profile["_id"] = str(profile["_id"])
    profile["user_id"] = str(profile["user_id"])
    
    return {
        "profile": profile,
        "courses": courses,
        "email": current_user.email,
        "username": current_user.username
    }

@router.put("/profile", response_model=dict)
async def update_teacher_profile(
    full_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    position: Optional[str] = Form(None),
    office: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Update teacher profile.
    """
    # Get current profile
    profile = await db.teacher_profiles.find_one({"user_id": ObjectId(current_user.id)})
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Prepare update data
    update_data = {}
    
    if full_name is not None:
        update_data["full_name"] = full_name
    
    if bio is not None:
        update_data["bio"] = bio
    
    if phone is not None:
        update_data["phone"] = phone
    
    if address is not None:
        update_data["address"] = address
    
    if department is not None:
        update_data["department"] = department
    
    if position is not None:
        update_data["position"] = position
    
    if office is not None:
        update_data["office"] = office
    
    # Save profile picture if provided
    if profile_picture:
        profile_picture_path = await save_upload(profile_picture, "profile_pictures")
        update_data["profile_picture"] = profile_picture_path
    
    # Update profile
    if update_data:
        await db.teacher_profiles.update_one(
            {"user_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
    
    # Get updated profile
    updated_profile = await db.teacher_profiles.find_one({"user_id": ObjectId(current_user.id)})
    updated_profile["_id"] = str(updated_profile["_id"])
    updated_profile["user_id"] = str(updated_profile["user_id"])
    
    return {
        "message": "Profile updated successfully",
        "profile": updated_profile
    }

@router.get("/dashboard", response_model=dict)
async def get_teacher_dashboard(current_user: User = Depends(get_current_teacher)) -> Any:
    """
    Get teacher dashboard data.
    """
    # Get courses
    courses = []
    courses_cursor = db.courses.find({"teacher_id": ObjectId(current_user.id)})
    
    async for course in courses_cursor:
        # Get enrollment count
        enrollment_count = await db.enrollments.count_documents({
            "course_id": course["_id"]
        })
        
        courses.append({
            "_id": str(course["_id"]),
            "name": course["courseName"],
            "code": course["courseCode"],
            "studentsCount": enrollment_count,
            "status": course["enrollmentStatus"]
        })
    
    # Get total student count (unique students across all courses)
    student_ids = set()
    enrollments_cursor = db.enrollments.find({
        "course_id": {"$in": [c["_id"] for c in await db.courses.find({"teacher_id": ObjectId(current_user.id)}).to_list(length=None)]}
    })
    
    async for enrollment in enrollments_cursor:
        student_ids.add(str(enrollment["student_id"]))
    
    # Get pending assignments
    pending_assignments = []
    assignments_cursor = db.assignments.find({
        "teacher_id": ObjectId(current_user.id),
        "deadline": {"$gte": datetime.utcnow()}
    }).sort("deadline", 1).limit(5)
    
    async for assignment in assignments_cursor:
        # Get submission count
        submission_count = await db.assignment_submissions.count_documents({
            "assignment_id": assignment["_id"]
        })
        
        # Get total students in course
        total_students = await db.enrollments.count_documents({
            "course_id": assignment["course"]
        })
        
        pending_assignments.append({
            "id": str(assignment["_id"]),
            "title": assignment["title"],
            "courseName": assignment["courseName"],
            "dueDate": assignment["deadline"].strftime("%b %d, %Y"),
            "submissionCount": submission_count,
            "totalStudents": total_students
        })
    
    # Get upcoming classes (this would be more complex in a real app with scheduling)
    upcoming_classes = [
        {
            "courseName": "Introduction to React",
            "topic": "React Hooks",
            "time": "10:00 AM",
            "date": datetime.utcnow().strftime("%b %d, %Y"),
            "studentsCount": 25
        },
        {
            "courseName": "Advanced JavaScript",
            "topic": "Promises and Async/Await",
            "time": "2:00 PM",
            "date": datetime.utcnow().strftime("%b %d, %Y"),
            "studentsCount": 18
        },
        {
            "courseName": "UX/UI Design Fundamentals",
            "topic": "User Research Methods",
            "time": "11:30 AM",
            "date": (datetime.utcnow() + timedelta(days=1)).strftime("%b %d, %Y"),
            "studentsCount": 22
        }
    ]
    
    return {
        "courses": courses,
        "totalStudents": len(student_ids),
        "pendingAssignments": pending_assignments,
        "upcomingClasses": upcoming_classes
    }

