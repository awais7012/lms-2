from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models.user import User
from app.models.material import Material, MaterialCreate, MaterialUpdate
from app.api.deps import get_current_teacher, get_current_student, get_current_user
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from bson import ObjectId
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/upload", response_model=dict)
async def upload_material(
    title: str = Form(...),
    type: str = Form(...),
    course_id: str = Form(...),
    module_id: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Upload course material (teacher only).
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
    if module_id:
        module = await db.modules.find_one({
            "_id": ObjectId(module_id),
            "course_id": ObjectId(course_id)
        })
        
        if not module:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Module not found or doesn't belong to this course"
            )
    
    # Validate material type
    if type not in ["document", "video", "link"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid material type. Must be document, video, or link"
        )
    
    # For link type, URL is required
    if type == "link" and not url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL is required for link type materials"
        )
    
    # For document or video type, file is required
    if type in ["document", "video"] and not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is required for document or video type materials"
        )
    
    # Save file if provided
    file_path = None
    file_size = None
    file_format = None
    
    if file:
        file_path = await save_upload(file, "course_materials")
        file_size = f"{file.size / (1024 * 1024):.2f} MB"  # Convert to MB
        file_format = file.filename.split(".")[-1].upper() if "." in file.filename else None
    
    # Create material
    material_data = {
        "title": title,
        "type": type,
        "course_id": ObjectId(course_id),
        "module_id": ObjectId(module_id) if module_id else None,
        "description": description,
        "file_path": file_path,
        "url": url,
        "format": file_format,
        "size": file_size,
        "uploaded_by": ObjectId(current_user.id),
        "access_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.materials.insert_one(material_data)
    
    # Create notifications for all enrolled students
    enrollments_cursor = db.enrollments.find({"course_id": ObjectId(course_id)})
    
    async for enrollment in enrollments_cursor:
        notification_data = {
            "title": "New Course Material",
            "message": f"New {type} material '{title}' has been added to {course['courseName']}",
            "type": "material",
            "recipient_id": enrollment["student_id"],
            "sender_id": ObjectId(current_user.id),
            "course_id": ObjectId(course_id),
            "read": False,
            "created_at": datetime.utcnow()
        }
        
        await db.notifications.insert_one(notification_data)
    
    return {
        "message": "Material uploaded successfully",
        "material": {
            "_id": str(result.inserted_id),
            **material_data,
            "course_id": str(material_data["course_id"]),
            "module_id": str(material_data["module_id"]) if material_data["module_id"] else None,
            "uploaded_by": str(material_data["uploaded_by"])
        }
    }

@router.get("/course/{course_id}", response_model=dict)
async def get_course_materials(
    course_id: str,
    module_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get materials for a course.
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
    
    # Build query
    query = {"course_id": ObjectId(course_id)}
    
    if module_id:
        query["module_id"] = ObjectId(module_id)
    
    # Get materials
    materials = []
    cursor = db.materials.find(query)
    
    async for material in cursor:
        material["_id"] = str(material["_id"])
        material["course_id"] = str(material["course_id"])
        if material["module_id"]:
            material["module_id"] = str(material["module_id"])
        material["uploaded_by"] = str(material["uploaded_by"])
        materials.append(material)
    
    return {"materials": materials}

@router.get("/{material_id}", response_model=dict)
async def get_material(
    material_id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get a specific material.
    """
    # Check if material exists
    material = await db.materials.find_one({"_id": ObjectId(material_id)})
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # If user is a student, check if they're enrolled in the course
    if current_user.role == "student":
        enrollment = await db.enrollments.find_one({
            "course_id": material["course_id"],
            "student_id": ObjectId(current_user.id)
        })
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this course"
            )
        
        # Increment access count
        await db.materials.update_one(
            {"_id": ObjectId(material_id)},
            {"$inc": {"access_count": 1}}
        )
    
    material["_id"] = str(material["_id"])
    material["course_id"] = str(material["course_id"])
    if material["module_id"]:
        material["module_id"] = str(material["module_id"])
    material["uploaded_by"] = str(material["uploaded_by"])
    
    return {"material": material}

@router.delete("/{material_id}", response_model=dict)
async def delete_material(
    material_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Delete a material (teacher only).
    """
    # Check if material exists and belongs to a course taught by the teacher
    material = await db.materials.find_one({"_id": ObjectId(material_id)})
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    # Check if course belongs to the teacher
    course = await db.courses.find_one({
        "_id": material["course_id"],
        "teacher_id": ObjectId(current_user.id)
    })
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this material"
        )
    
    # Delete material
    await db.materials.delete_one({"_id": ObjectId(material_id)})
    
    return {"message": "Material deleted successfully"}

