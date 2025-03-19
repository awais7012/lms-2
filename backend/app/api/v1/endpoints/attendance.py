from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from app.models.user import User
from app.models.attendance import AttendanceRecord, AttendanceCreate, AttendanceUpdate, AttendanceBulkCreate
from app.api.deps import get_current_teacher, get_current_student
from app.db.mongodb import db
from bson import ObjectId
import logging
from datetime import datetime, date

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/record", response_model=dict)
async def record_attendance(
    attendance: AttendanceCreate,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Record attendance for a student (teacher only).
    """
    # Check if course exists and belongs to the teacher
    course = await db.courses.find_one({
        "_id": ObjectId(attendance.course_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you don't have permission"
        )
    
    # Check if student is enrolled in the course
    enrollment = await db.enrollments.find_one({
        "course_id": ObjectId(attendance.course_id),
        "student_id": ObjectId(attendance.student_id)
    })
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not enrolled in this course"
        )
    
    # Check if attendance record already exists for this date
    existing_record = await db.attendance.find_one({
        "course_id": ObjectId(attendance.course_id),
        "student_id": ObjectId(attendance.student_id),
        "date": attendance.date.isoformat()
    })
    
    if existing_record:
        # Update existing record
        await db.attendance.update_one(
            {"_id": existing_record["_id"]},
            {
                "$set": {
                    "status": attendance.status,
                    "time": attendance.time,
                    "note": attendance.note
                }
            }
        )
        
        return {"message": "Attendance record updated successfully"}
    
    # Create new attendance record
    attendance_data = {
        "course_id": ObjectId(attendance.course_id),
        "student_id": ObjectId(attendance.student_id),
        "date": attendance.date,
        "status": attendance.status,
        "time": attendance.time,
        "note": attendance.note,
        "recorded_by": ObjectId(current_user.id),
        "created_at": datetime.utcnow()
    }
    
    await db.attendance.insert_one(attendance_data)
    
    return {"message": "Attendance recorded successfully"}

@router.post("/bulk-record", response_model=dict)
async def bulk_record_attendance(
    attendance_data: AttendanceBulkCreate,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Record attendance for multiple students at once (teacher only).
    """
    # Check if course exists and belongs to the teacher
    course = await db.courses.find_one({
        "_id": ObjectId(attendance_data.course_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you don't have permission"
        )
    
    # Process each student record
    for record in attendance_data.records:
        # Check if student is enrolled in the course
        enrollment = await db.enrollments.find_one({
            "course_id": ObjectId(attendance_data.course_id),
            "student_id": ObjectId(record["student_id"])
        })
        
        if not enrollment:
            continue  # Skip students not enrolled
        
        # Check if attendance record already exists for this date
        existing_record = await db.attendance.find_one({
            "course_id": ObjectId(attendance_data.course_id),
            "student_id": ObjectId(record["student_id"]),
            "date": attendance_data.date.isoformat()
        })
        
        if existing_record:
            # Update existing record
            await db.attendance.update_one(
                {"_id": existing_record["_id"]},
                {
                    "$set": {
                        "status": record["status"],
                        "time": record.get("time"),
                        "note": record.get("note")
                    }
                }
            )
        else:
            # Create new attendance record
            new_record = {
                "course_id": ObjectId(attendance_data.course_id),
                "student_id": ObjectId(record["student_id"]),
                "date": attendance_data.date.isoformat(),
                "status": record["status"],
                "time": record.get("time"),
                "note": record.get("note"),
                "recorded_by": ObjectId(current_user.id),
                "created_at": datetime.utcnow()
            }
            
            await db.attendance.insert_one(new_record)
    
    return {"message": "Attendance recorded successfully for all students"}

@router.get("/course/{course_id}", response_model=dict)
async def get_course_attendance(
    course_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Get attendance records for a course (teacher only).
    """
    # Check if course exists and belongs to the teacher
    course = await db.courses.find_one({
        "_id": ObjectId(course_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you don't have permission"
        )
    
    # Build query
    query = {"course_id": ObjectId(course_id)}
    
    if start_date and end_date:
        try:
            start = datetime.fromisoformat(start_date).date()
            end = datetime.fromisoformat(end_date).date()
            query["date"] = {"$gte": start.isoformat(), "$lte": end.isoformat()}
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date format. Use ISO format (YYYY-MM-DD)"
            )
    
    # Get attendance records
    records = []
    cursor = db.attendance.find(query)
    
    async for record in cursor:
        # Get student details
        student = await db.users.find_one({"_id": record["student_id"]})
        
        if student:
            record["_id"] = str(record["_id"])
            record["course_id"] = str(record["course_id"])
            record["student_id"] = str(record["student_id"])
            record["recorded_by"] = str(record["recorded_by"])
            record["student_name"] = student["username"]
            records.append(record)
    
    return {"attendance_records": records}

@router.get("/student", response_model=dict)
async def get_student_attendance(
    course_id: Optional[str] = None,
    current_user: User = Depends(get_current_student)
) -> Any:
    """
    Get attendance records for the current student.
    """
    # Build query
    query = {"student_id": ObjectId(current_user.id)}
    
    if course_id:
        query["course_id"] = ObjectId(course_id)
    
    # Get attendance records
    records = []
    cursor = db.attendance.find(query)
    
    async for record in cursor:
        # Get course details
        course = await db.courses.find_one({"_id": record["course_id"]})
        
        if course:
            record["_id"] = str(record["_id"])
            record["course_id"] = str(record["course_id"])
            record["student_id"] = str(record["student_id"])
            record["recorded_by"] = str(record["recorded_by"])
            record["course_name"] = course["courseName"]
            records.append(record)
    
    # Calculate statistics
    total_records = len(records)
    present_count = sum(1 for record in records if record["status"] == "Present")
    absent_count = sum(1 for record in records if record["status"] == "Absent")
    late_count = sum(1 for record in records if record["status"] == "Late")
    excused_count = sum(1 for record in records if record["status"] == "Excused")
    
    attendance_rate = 0
    if total_records > 0:
        attendance_rate = (present_count / total_records) * 100
    
    return {
        "attendance_records": records,
        "statistics": {
            "total": total_records,
            "present": present_count,
            "absent": absent_count,
            "late": late_count,
            "excused": excused_count,
            "attendance_rate": round(attendance_rate, 2)
        }
    }

