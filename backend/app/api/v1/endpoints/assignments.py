from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models.user import User
from app.models.assignment import Assignment, AssignmentCreate, AssignmentUpdate, AssignmentSubmission
from app.api.deps import get_current_teacher, get_current_student, get_current_user
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from bson import ObjectId
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create", response_model=dict)
async def create_assignment(
    title: str = Form(...),
    courseId: str = Form(...),
    courseName: str = Form(...),
    deadline: str = Form(...),
    description: Optional[str] = Form(None),
    attachmentFile: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    course = await db.courses.find_one({
        "_id": ObjectId(courseId),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you don't have permission"
        )
    
    attachment_path = None
    if attachmentFile:
        attachment_path = await save_upload(attachmentFile, "assignment_files")
  
    try:
        deadline_date = datetime.fromisoformat(deadline)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid deadline format. Use ISO format (YYYY-MM-DD)"
        )

    assignment_data = {
        "title": title,
        "description": description,
        "deadline": deadline_date,
        "course": ObjectId(courseId),
        "courseName": courseName,
        "teacher_id": ObjectId(current_user.id),
        "attachmentFile": attachment_path,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.assignments.insert_one(assignment_data)

    enrollments_cursor = db.enrollments.find({"course_id": ObjectId(courseId)})
    
    async for enrollment in enrollments_cursor:
        notification_data = {
            "title": "New Assignment",
            "message": f"New assignment '{title}' has been posted for {courseName}",
            "type": "assignment",
            "recipient_id": enrollment["student_id"],
            "sender_id": ObjectId(current_user.id),
            "course_id": ObjectId(courseId),
            "read": False,
            "created_at": datetime.utcnow()
        }
        
        await db.notifications.insert_one(notification_data)
    
        assignment_id = str(result.inserted_id)

        return {
    "message": "Assignment created successfully",
    "assignment": {
        "_id": assignment_id,
        "title": title,
        "description": description,
        "deadline": deadline_date.isoformat(),
        "course": str(course["_id"]),
        "courseName": courseName,
        "teacher_id": str(current_user.id),
        "attachmentFile": attachment_path,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
}


@router.get("/teacher", response_model=dict)
async def get_teacher_assignments(current_user: User = Depends(get_current_teacher)) -> Any:
    """
    Get all assignments created by the current teacher.
    """
    assignments = []
    cursor = db.assignments.find({"teacher_id": ObjectId(current_user.id)})
    
    async for assignment in cursor:
        course = await db.courses.find_one({"_id": assignment["course"]})
        submission_count = await db.assignment_submissions.count_documents({
            "assignment_id": assignment["_id"]
        })
        total_students = await db.enrollments.count_documents({
            "course_id": assignment["course"]
        })
        
        assignment["_id"] = str(assignment["_id"])
        assignment["course"] = str(assignment["course"])
        assignment["teacher_id"] = str(assignment["teacher_id"])
        assignment["submissionCount"] = submission_count
        assignment["totalStudents"] = total_students
        
        assignments.append(assignment)
    
    return {"assignments": assignments}

@router.get("/student", response_model=dict)
async def get_student_assignments(current_user: User = Depends(get_current_student)) -> Any:
    enrolled_courses = []
    enrollments_cursor = db.enrollments.find({"student_id": ObjectId(current_user.id)})
    
    async for enrollment in enrollments_cursor:
        enrolled_courses.append(enrollment["course_id"])
    
    if not enrolled_courses:
        return {"assignments": []}
    assignments = []
    cursor = db.assignments.find({
        "course": {"$in": enrolled_courses}
    })
    
    async for assignment in cursor:
        submission = await db.assignment_submissions.find_one({
            "assignment_id": assignment["_id"],
            "student_id": ObjectId(current_user.id)
        })
        
        assignment["_id"] = str(assignment["_id"])
        assignment["course"] = str(assignment["course"])
        assignment["teacher_id"] = str(assignment["teacher_id"])
        assignment["submitted"] = submission is not None
        
        if submission:
            assignment["submission"] = {
                "_id": str(submission["_id"]),
                "submitted_at": submission["submitted_at"],
                "status": submission["status"],
                "score": submission.get("score"),
                "feedback": submission.get("feedback")
            }
        
        assignments.append(assignment)
    
    return {"assignments": assignments}

@router.put("/{assignment_id}", response_model=dict)
async def update_assignment(
    assignment_id: str,
    title: Optional[str] = Form(None),
    deadline: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    attachmentFile: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Update assignment (teacher only).
    """
    assignment = await db.assignments.find_one({
        "_id": ObjectId(assignment_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or you don't have permission"
        )
    update_data = {}
    
    if title:
        update_data["title"] = title
    
    if description is not None:
        update_data["description"] = description
    
    if deadline:
        try:
            deadline_date = datetime.fromisoformat(deadline)
            update_data["deadline"] = deadline_date
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid deadline format. Use ISO format (YYYY-MM-DD)"
            )
    if attachmentFile:
        attachment_path = await save_upload(attachmentFile, "assignment_files")
        update_data["attachmentFile"] = attachment_path
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.assignments.update_one(
        {"_id": ObjectId(assignment_id)},
        {"$set": update_data}
    )
    
    updated_assignment = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    updated_assignment["_id"] = str(updated_assignment["_id"])
    updated_assignment["course"] = str(updated_assignment["course"])
    updated_assignment["teacher_id"] = str(updated_assignment["teacher_id"])
    
    return {
        "message": "Assignment updated successfully",
        "assignment": updated_assignment
    }

@router.delete("/{assignment_id}", response_model=dict)
async def delete_assignment(
    assignment_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Delete assignment (teacher only).
    """
    assignment = await db.assignments.find_one({
        "_id": ObjectId(assignment_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or you don't have permission"
        )
    await db.assignments.delete_one({"_id": ObjectId(assignment_id)})

    await db.assignment_submissions.delete_many({"assignment_id": ObjectId(assignment_id)})
    
    return {"message": "Assignment deleted successfully"}

@router.post("/{assignment_id}/submit", response_model=dict)
async def submit_assignment(
    assignment_id: str,
    submission_text: Optional[str] = Form(None),
    submission_file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_student)
) -> Any:
    """
    Submit assignment (student only).
    """
    assignment = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    enrollment = await db.enrollments.find_one({
        "course_id": assignment["course"],
        "student_id": ObjectId(current_user.id)
    })
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not enrolled in this course"
        )

    if datetime.utcnow() > assignment["deadline"]:
        status = "Late"
    else:
        status = "Submitted"
    existing_submission = await db.assignment_submissions.find_one({
        "assignment_id": ObjectId(assignment_id),
        "student_id": ObjectId(current_user.id)
    })
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted this assignment"
        )
    submission_file_path = None
    if submission_file:
        submission_file_path = await save_upload(submission_file, "assignment_submissions")
    
    submission_data = {
        "assignment_id": ObjectId(assignment_id),
        "student_id": ObjectId(current_user.id),
        "submission_file": submission_file_path,
        "submission_text": submission_text,
        "submitted_at": datetime.utcnow(),
        "status": status
    }
    
    result = await db.assignment_submissions.insert_one(submission_data)
    
    notification_data = {
        "title": "Assignment Submission",
        "message": f"Student {current_user.username} has submitted assignment '{assignment['title']}'",
        "type": "assignment",
        "recipient_id": assignment["teacher_id"],
        "sender_id": ObjectId(current_user.id),
        "course_id": assignment["course"],
        "read": False,
        "created_at": datetime.utcnow()
    }
    
    await db.notifications.insert_one(notification_data)
    
    return {"message": "Assignment submitted successfully"}

@router.post("/{assignment_id}/grade/{student_id}", response_model=dict)
async def grade_assignment(
    assignment_id: str,
    student_id: str,
    score: float = Form(...),
    feedback: Optional[str] = Form(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Grade assignment submission (teacher only).
    """
    assignment = await db.assignments.find_one({
        "_id": ObjectId(assignment_id),
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or you don't have permission"
        )
    
    submission = await db.assignment_submissions.find_one({
        "assignment_id": ObjectId(assignment_id),
        "student_id": ObjectId(student_id)
    })
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    await db.assignment_submissions.update_one(
        {"_id": submission["_id"]},
        {
            "$set": {
                "score": score,
                "feedback": feedback,
                "status": "Graded",
                "graded_at": datetime.utcnow()
            }
        }
    )
    
    notification_data = {
        "title": "Assignment Graded",
        "message": f"Your submission for '{assignment['title']}' has been graded",
        "type": "grade",
        "recipient_id": ObjectId(student_id),
        "sender_id": ObjectId(current_user.id),
        "course_id": assignment["course"],
        "read": False,
        "created_at": datetime.utcnow()
    }
    
    await db.notifications.insert_one(notification_data)
    
    return {"message": "Assignment graded successfully"}

@router.get("/submissions/{assignment_id}", response_model=dict)
async def get_submissions_by_assignment(
    assignment_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Get submissions for a specific assignment created by the current teacher.
    """
    assignment = await db.assignments.find_one({"_id": ObjectId(assignment_id)})
    
    if not assignment or assignment["teacher_id"] != ObjectId(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view these submissions"
        )

    submissions_list = []
    cursor = db.assignment_submissions.find({"assignment_id": ObjectId(assignment_id)})

    async for submission in cursor:
        student = await db.users.find_one({"_id": submission["student_id"]})
        
        submissions_list.append({
            "_id": str(submission["_id"]),
            "studentName": student["username"],
            "file": submission["submission_file"],
            "assignment_id": str(submission["assignment_id"]),
            "student_id": str(submission["student_id"])
        })
    
    return {"submissions": submissions_list}
