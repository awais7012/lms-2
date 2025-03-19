from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models.user import User, UserProfile, StudentProfile
from app.api.deps import get_current_student, get_current_teacher
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from bson import ObjectId
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/profile", response_model=dict)
async def get_student_profile(current_user: User = Depends(get_current_student)) -> Any:
    """
    Get current student's profile.
    """
    # Get student profile
    profile = await db.student_profiles.find_one({"user_id": ObjectId(current_user.id)})
    
    if not profile:
        # Create empty profile if it doesn't exist
        profile = {
            "user_id": ObjectId(current_user.id),
            "full_name": current_user.username,
            "bio": None,
            "profile_picture": None,
            "phone": None,
            "address": None,
            "enrollment_date": datetime.utcnow(),
            "student_id": f"ST-{str(current_user.id)[-6:]}"
        }
        
        await db.student_profiles.insert_one(profile)
    
    # Get enrollment data
    enrollments = []
    enrollments_cursor = db.enrollments.find({"student_id": ObjectId(current_user.id)})
    
    async for enrollment in enrollments_cursor:
        course = await db.courses.find_one({"_id": enrollment["course_id"]})
        if course:
            enrollments.append({
                "course_id": str(enrollment["course_id"]),
                "course_name": course["courseName"],
                "enrollment_date": enrollment["enrollment_date"],
                "progress": enrollment["progress"],
                "status": enrollment["status"]
            })
    
    # Format profile data
    profile["_id"] = str(profile["_id"])
    profile["user_id"] = str(profile["user_id"])
    
    return {
        "profile": profile,
        "enrollments": enrollments,
        "email": current_user.email,
        "username": current_user.username
    }

@router.put("/profile", response_model=dict)
async def update_student_profile(
    full_name: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_student)
) -> Any:
    """
    Update student profile.
    """
    # Get current profile
    profile = await db.student_profiles.find_one({"user_id": ObjectId(current_user.id)})
    
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
    
    # Save profile picture if provided
    if profile_picture:
        profile_picture_path = await save_upload(profile_picture, "profile_pictures")
        update_data["profile_picture"] = profile_picture_path
    
    # Update profile
    if update_data:
        await db.student_profiles.update_one(
            {"user_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
    
    # Get updated profile
    updated_profile = await db.student_profiles.find_one({"user_id": ObjectId(current_user.id)})
    updated_profile["_id"] = str(updated_profile["_id"])
    updated_profile["user_id"] = str(updated_profile["user_id"])
    
    return {
        "message": "Profile updated successfully",
        "profile": updated_profile
    }

@router.get("/progress", response_model=dict)
async def get_student_progress(current_user: User = Depends(get_current_student)) -> Any:
    """
    Get student's learning progress across all courses.
    """
    # Get enrollments
    enrollments = []
    enrollments_cursor = db.enrollments.find({"student_id": ObjectId(current_user.id)})
    
    async for enrollment in enrollments_cursor:
        course = await db.courses.find_one({"_id": enrollment["course_id"]})
        if course:
            # Get assignment submissions for this course
            assignments_cursor = db.assignments.find({"course": enrollment["course_id"]})
            total_assignments = await assignments_cursor.count()
            
            submissions_cursor = db.assignment_submissions.find({
                "student_id": ObjectId(current_user.id),
                "assignment_id": {"$in": [a["_id"] async for a in db.assignments.find({"course": enrollment["course_id"]})]}
            })
            
            submissions = []
            async for submission in submissions_cursor:
                submissions.append(submission)
            
            # Calculate score
            score = 0
            if submissions:
                graded_submissions = [s for s in submissions if s.get("score") is not None]
                if graded_submissions:
                    total_score = sum(s["score"] for s in graded_submissions)
                    score = (total_score / (len(graded_submissions) * 100)) * 100
            
            # Get attendance data
            attendance_records = []
            attendance_cursor = db.attendance.find({
                "course_id": enrollment["course_id"],
                "student_id": ObjectId(current_user.id)
            })
            
            async for record in attendance_cursor:
                attendance_records.append(record)
            
            # Calculate attendance percentage
            attendance = 0
            if attendance_records:
                present_count = sum(1 for record in attendance_records if record["status"] == "Present")
                attendance = (present_count / len(attendance_records)) * 100
            
            enrollments.append({
                "course_id": str(enrollment["course_id"]),
                "course_name": course["courseName"],
                "instructor": course["instructorName"],
                "progress": enrollment["progress"],
                "score": round(score),
                "attendance": round(attendance),
                "completed": enrollment["progress"] >= 100,
                "completed_lessons": 0,  # This would need to be calculated based on lesson completion tracking
                "total_lessons": 0  # This would need to be calculated from course modules/lessons
            })
    
    # Calculate overall progress
    overall_progress = 0
    if enrollments:
        overall_progress = sum(e["progress"] for e in enrollments) / len(enrollments)
    
    # Get weekly activity data (this would be more complex in a real app)
    weekly_activity = [
        {"day": "Mon", "hours": 2.5},
        {"day": "Tue", "hours": 1.8},
        {"day": "Wed", "hours": 3.2},
        {"day": "Thu", "hours": 2.0},
        {"day": "Fri", "hours": 1.5},
        {"day": "Sat", "hours": 0.5},
        {"day": "Sun", "hours": 1.0}
    ]
    
    return {
        "overall_progress": round(overall_progress),
        "courses": enrollments,
        "weekly_activity": weekly_activity
    }

