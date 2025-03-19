from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Body
from app.models.user import User
from app.models.course import Course, CourseCreate, CourseUpdate, Module, Lesson, Enrollment
from app.api.deps import get_current_teacher, get_current_student, get_current_user
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from bson import ObjectId
import logging
from datetime import datetime
from pydantic import BaseModel,Field

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/addCourse", response_model=dict)
async def create_course(
    courseName: str = Form(...),
    courseCode: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    duration: int = Form(...),
    price: float = Form(...),
    maxStudents: int = Form(...),
    difficulty: str = Form(...),
    instructorName: str = Form(...),
    thumbnail: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Create new course (teacher only).
    """
    # Check if course code already exists
    existing_course = await db.courses.find_one({"courseCode": courseCode})
    if existing_course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course with this code already exists"
        )
    
    # Save thumbnail if provided
    thumbnail_path = None
    if thumbnail:
        thumbnail_path = await save_upload(thumbnail, "course_thumbnails")
    
    # Create course
    course_data = {
        "courseName": courseName,
        "courseCode": courseCode,
        "description": description,
        "category": category,
        "duration": duration,
        "price": price,
        "maxStudents": maxStudents,
        "difficulty": difficulty,
        "instructorName": instructorName,
        "teacher_id": str(ObjectId(current_user.id)), 
        "thumbnail": thumbnail_path,
        "enrollmentStatus": "Open",
        "studentsEnrolled": 0,
        "hasModules": False,
        "hasQuizzes": False,
        "certificateOffered": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.courses.insert_one(course_data)
    
    return {
        "message": "Course created successfully",
        "course": {
            "_id": str(result.inserted_id),
            **course_data,
            "thumbnail": thumbnail_path
        }
    }

@router.get("/teacher/courses", response_model=dict)
async def get_teacher_courses(current_user: User = Depends(get_current_teacher)) -> Any:
    """
    Get all courses created by the current teacher.
    """
    courses = []
    cursor = db.courses.find({"teacher_id": ObjectId(current_user.id)})
    
    async for course in cursor:
        course["_id"] = str(course["_id"])
        course["teacher_id"] = str(course["teacher_id"])
        courses.append(course)
    
    return {"courses": courses}

@router.get("/getallcourses", response_model=dict)
async def get_all_courses(current_user: User = Depends(get_current_student)) -> Any:
    """
    Get all available courses for students to enroll.
    """
    # Get courses the student is already enrolled in
    enrolled_courses = []
    enrollments_cursor = db.enrollments.find({"student_id": ObjectId(current_user.id)})
    
    async for enrollment in enrollments_cursor:
        enrolled_courses.append(str(enrollment["course_id"]))
    
    # Get all courses that the student is not enrolled in
    courses = []
    cursor = db.courses.find({
        "_id": {"$nin": [ObjectId(course_id) for course_id in enrolled_courses]},
        "enrollmentStatus": "Open"
    })
    
    async for course in cursor:
        course["_id"] = str(course["_id"])
        course["teacher_id"] = str(course["teacher_id"])
        courses.append(course)
    
    return {"courses": courses}

@router.get("/enrolled", response_model=dict)
async def get_enrolled_courses(current_user: User = Depends(get_current_student)) -> Any:
    """
    Get all courses the student is enrolled in.
    """
    courses = []
    
    # Get enrollments for the student
    enrollments_cursor = db.enrollments.find({"student_id": ObjectId(current_user.id)})
    
    async for enrollment in enrollments_cursor:
        # Get course details
        course = await db.courses.find_one({"_id": enrollment["course_id"]})
        if course:
            course["_id"] = str(course["_id"])
            course["teacher_id"] = str(course["teacher_id"])
            course["progress"] = enrollment["progress"]
            courses.append(course)
    
    return {"courses": courses}
class posted(BaseModel):
    courseId:str
@router.post("/enroll", response_model=dict)
async def enroll_in_course(request: posted ,current_user: User = Depends(get_current_student)):
    """
    Enroll student in a course.
    """
    courseId = request.dict().get("courseId")
    # Check if course exists
    course = await db.courses.find_one({"_id": ObjectId(courseId)})
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if student is already enrolled
    existing_enrollment = await db.enrollments.find_one({
        "course_id": ObjectId(courseId),
        "student_id": ObjectId(current_user.id)
    })
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    # Check if course is full
    if course["studentsEnrolled"] >= course["maxStudents"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course is full"
        )
    
    # Create enrollment
    enrollment_data = {
        "course_id": ObjectId(courseId),
        "student_id": ObjectId(current_user.id),
        "enrollment_date": datetime.utcnow(),
        "progress": 0,
        "status": "Active"
    }
    
    await db.enrollments.insert_one(enrollment_data)
    
    # Update course enrollment count
    await db.courses.update_one(
        {"_id": ObjectId(courseId)},
        {"$inc": {"studentsEnrolled": 1}}
    )
    
    return {"message": "Successfully enrolled in course"}

@router.get("/{course_id}/manage", response_model=dict)
async def get_course_details(
    course_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Get course details for management (teacher only).
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
    
    # Get modules and lessons
    modules = []
    modules_cursor = db.modules.find({"course_id": ObjectId(course_id)}).sort("order", 1)
    
    async for module in modules_cursor:
        module_id = module["_id"]
        module["_id"] = str(module_id)
        module["course_id"] = str(module["course_id"])
        
        # Get lessons for this module
        lessons = []
        lessons_cursor = db.lessons.find({"module_id": module_id}).sort("order", 1)
        
        async for lesson in lessons_cursor:
            lesson["_id"] = str(lesson["_id"])
            lesson["module_id"] = str(lesson["module_id"])
            lessons.append(lesson)
        
        module["lessons"] = lessons
        modules.append(module)
    
    # Get materials
    materials = []
    materials_cursor = db.materials.find({"course_id": ObjectId(course_id)})
    
    async for material in materials_cursor:
        material["_id"] = str(material["_id"])
        material["course_id"] = str(material["course_id"])
        if "module_id" in material and material["module_id"]:
            material["module_id"] = str(material["module_id"])
        materials.append(material)
    
    # Format course data
    course["_id"] = str(course["_id"])
    course["teacher_id"] = str(course["teacher_id"])
    course["modules"] = modules
    course["materials"] = materials
    
    return {"course": course}

class CourseUpdate(BaseModel):
    courseName: Optional[str] = Field(None, title="Course Name")
    courseCode: Optional[str] = Field(None, title="Course Code")
    description: Optional[str] = Field(None, title="Course Description")
    category: Optional[str] = Field(None, title="Category")
    duration: Optional[int] = Field(None, title="Duration in hours")
    price: Optional[float] = Field(None, title="Price")
    maxStudents: Optional[int] = Field(None, title="Max Students")
    difficulty: Optional[str] = Field(None, title="Difficulty Level")
    instructorName: Optional[str] = Field(None, title="Instructor Name")

@router.put("/{course_id}/manage", response_model=dict)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Update course details (teacher only).
    """
    # Validate course_id
    try:
        course_obj_id = ObjectId(course_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid course ID format")

    # Check if course exists and belongs to the teacher
    course = await db.courses.find_one({
        "_id": course_obj_id,
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you don't have permission"
        )
    
    # Extract update data
    update_data = {k: v for k, v in course_update.dict(exclude_unset=True).items() if v is not None}
    
    # If no valid fields to update, return an error
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields provided for update")

    update_data["updated_at"] = datetime.utcnow()
    
    # Perform update
    result = await db.courses.update_one(
        {"_id": course_obj_id},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes made to the course")

    return {"message": "Course updated successfully"}
@router.post("/{course_id}/modules", response_model=dict)
async def create_module(
    course_id: str,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Create a new module for a course (teacher only).
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
    
    # Get the highest order number
    last_module = await db.modules.find_one(
        {"course_id": ObjectId(course_id)},
        sort=[("order", -1)]
    )
    
    order = 1
    if last_module:
        order = last_module["order"] + 1
    
    # Create module
    module_data = {
        "course_id": ObjectId(course_id),
        "title": title,
        "description": description,
        "order": order,
        "created_at": datetime.utcnow()
    }
    
    result = await db.modules.insert_one(module_data)
    
    # Update course to indicate it has modules
    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$set": {"hasModules": True}}
    )
    
    return {
        "message": "Module created successfully",
        "module": {
            "_id": str(result.inserted_id),
            **module_data,
            "course_id": str(module_data["course_id"]),
            "lessons": []
        }
    }

@router.post("/{course_id}/modules/{module_id}/lessons", response_model=dict)
async def create_lesson(
    course_id: str,
    module_id: str,
    title: str = Form(...),
    duration: str = Form(...),
    description: Optional[str] = Form(None),
    materialType: Optional[str] = Form(None),
    materialUrl: Optional[str] = Form(None),
    material: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Create a new lesson for a module (teacher only).
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
    
    # Check if module exists and belongs to the course
    module = await db.modules.find_one({
        "_id": ObjectId(module_id),
        "course_id": ObjectId(course_id)
    })
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found or doesn't belong to this course"
        )
    
    # Get the highest order number
    last_lesson = await db.lessons.find_one(
        {"module_id": ObjectId(module_id)},
        sort=[("order", -1)]
    )
    
    order = 1
    if last_lesson:
        order = last_lesson["order"] + 1
    
    # Save material file if provided
    material_file = None
    if material and materialType in ["pdf", "video", "file"]:
        material_file = await save_upload(material, "lesson_materials")
    
    # Create lesson
    lesson_data = {
        "module_id": ObjectId(module_id),
        "title": title,
        "description": description,
        "duration": duration,
        "materialType": materialType,
        "materialUrl": materialUrl if materialType == "link" else None,
        "materialFile": material_file,
        "order": order,
        "created_at": datetime.utcnow()
    }
    
    result = await db.lessons.insert_one(lesson_data)
    
    return {
        "message": "Lesson created successfully",
        "lesson": {
            "_id": str(result.inserted_id),
            **lesson_data,
            "module_id": str(lesson_data["module_id"])
        }
    }

@router.delete("/{course_id}/modules/{module_id}/lessons/{lesson_id}", response_model=dict)
async def delete_lesson(
    course_id: str,
    module_id: str,
    lesson_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Delete a lesson (teacher only).
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
    
    # Check if module exists and belongs to the course
    module = await db.modules.find_one({
        "_id": ObjectId(module_id),
        "course_id": ObjectId(course_id)
    })
    
    if not module:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Module not found or doesn't belong to this course"
        )
    
    # Check if lesson exists and belongs to the module
    lesson = await db.lessons.find_one({
        "_id": ObjectId(lesson_id),
        "module_id": ObjectId(module_id)
    })
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found or doesn't belong to this module"
        )
    
    # Delete lesson
    await db.lessons.delete_one({"_id": ObjectId(lesson_id)})
    
    return {"message": "Lesson deleted successfully"}

@router.get("/{course_id}/modules", response_model=dict)
async def get_course_modules(
    course_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get all modules and lessons for a course.
    """
    # Check if course exists
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # If user is a student, check if they're enrolled
    if current_user.role == "student":
        enrollment = await db.enrollments.find_one({
            "course_id": ObjectId(course_id),
            "student_id": ObjectId(current_user.id)
        })
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this course"
            )
    
    # Get modules and lessons
    modules = []
    modules_cursor = db.modules.find({"course_id": ObjectId(course_id)}).sort("order", 1)
    
    async for module in modules_cursor:
        module_id = module["_id"]
        module["_id"] = str(module_id)
        module["course_id"] = str(module["course_id"])
        
        # Get lessons for this module
        lessons = []
        lessons_cursor = db.lessons.find({"module_id": module_id}).sort("order", 1)
        
        async for lesson in lessons_cursor:
            lesson["_id"] = str(lesson["_id"])
            lesson["module_id"] = str(lesson["module_id"])
            lessons.append(lesson)
        
        module["lessons"] = lessons
        modules.append(module)
    
    return {"modules": modules}

@router.get("/{course_id}/students", response_model=dict)
async def get_course_students(
    course_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Get all students enrolled in a course (teacher only).
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
    
    # Get enrollments for the course
    students = []
    enrollments_cursor = db.enrollments.find({"course_id": ObjectId(course_id)})
    
    async for enrollment in enrollments_cursor:
        # Get student details
        student = await db.users.find_one({"_id": enrollment["student_id"]})
        if student:
            # Get student profile
            profile = await db.student_profiles.find_one({"user_id": student["_id"]})
            
            # Get attendance data
            attendance_records = []
            attendance_cursor = db.attendance.find({
                "course_id": ObjectId(course_id),
                "student_id": student["_id"]
            })
            
            async for record in attendance_cursor:
                attendance_records.append(record)
            
            # Calculate attendance percentage
            attendance_percentage = 0
            if attendance_records:
                present_count = sum(1 for record in attendance_records if record["status"] == "Present")
                attendance_percentage = (present_count / len(attendance_records)) * 100
            
            # Get assignment submissions
            assignments_cursor = db.assignments.find({"course": ObjectId(course_id)})
            total_assignments = await assignments_cursor.count()
            
            submissions_cursor = db.assignment_submissions.find({
                "student_id": student["_id"],
                "assignment_id": {"$in": [a["_id"] async for a in db.assignments.find({"course": ObjectId(course_id)})]}
            })
            
            submissions = []
            async for submission in submissions_cursor:
                submissions.append(submission)
            
            # Calculate performance
            performance = 0
            if submissions:
                graded_submissions = [s for s in submissions if s.get("score") is not None]
                if graded_submissions:
                    total_score = sum(s["score"] for s in graded_submissions)
                    performance = (total_score / (len(graded_submissions) * 100)) * 100
            
            students.append({
                "_id": str(student["_id"]),
                "username": student["username"],
                "email": student["email"],
                "progress": enrollment["progress"],
                "status": enrollment["status"],
                "enrollment_date": enrollment["enrollment_date"],
                "attendance": round(attendance_percentage),
                "performance": round(performance),
                "full_name": profile.get("full_name") if profile else student["username"]
            })
    
    return {"students": students}

