from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models.user import User
from app.models.certificate import Certificate, CertificateCreate, StudentCertificate
from app.api.deps import get_current_teacher, get_current_student, get_current_user, get_current_superuser
from app.db.mongodb import db
from app.utils.file_upload import save_upload
from app.utils.certificate_generator import generate_certificate
from bson import ObjectId
import logging
from datetime import datetime
import uuid

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create", response_model=dict)
async def create_certificate_template(
    title: str = Form(...),
    course_id: str = Form(...),
    description: Optional[str] = Form(None),
    template: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Create certificate template for a course (teacher only).
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
    
    # Check if certificate template already exists for this course
    existing_certificate = await db.certificates.find_one({
        "course_id": ObjectId(course_id)
    })
    
    if existing_certificate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate template already exists for this course"
        )
    
    # Save template file if provided
    template_path = None
    if template:
        template_path = await save_upload(template, "certificate_templates")
    
    # Create certificate template
    certificate_data = {
        "course_id": ObjectId(course_id),
        "title": title,
        "description": description,
        "template": template_path,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await db.certificates.insert_one(certificate_data)
    
    # Update course to indicate it offers certificates
    await db.courses.update_one(
        {"_id": ObjectId(course_id)},
        {
            "$set": {
                "certificateOffered": True,
                "certificateTitle": title,
                "certificateDescription": description
            }
        }
    )
    
    return {
        "message": "Certificate template created successfully",
        "certificate": {
            "_id": str(result.inserted_id),
            **certificate_data,
            "course_id": str(certificate_data["course_id"])
        }
    }

@router.post("/issue/{course_id}/{student_id}", response_model=dict)
async def issue_certificate(
    course_id: str,
    student_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Issue a certificate to a student (teacher only).
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
    
    # Check if certificate template exists for this course
    certificate = await db.certificates.find_one({
        "course_id": ObjectId(course_id)
    })
    
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No certificate template found for this course"
        )
    
    # Check if student is enrolled in the course
    enrollment = await db.enrollments.find_one({
        "course_id": ObjectId(course_id),
        "student_id": ObjectId(student_id)
    })
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not enrolled in this course"
        )
    
    # Check if certificate already issued to this student
    existing_certificate = await db.student_certificates.find_one({
        "certificate_id": certificate["_id"],
        "student_id": ObjectId(student_id)
    })
    
    if existing_certificate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate already issued to this student"
        )
    
    # Get student details
    student = await db.users.find_one({"_id": ObjectId(student_id)})
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Generate unique credential ID
    credential_id = f"CERT-{course['courseCode']}-{uuid.uuid4().hex[:6].upper()}"
    
    # Generate certificate file
    certificate_url = await generate_certificate(
        student_name=student["username"],
        course_name=course["courseName"],
        certificate_title=certificate["title"],
        instructor_name=course["instructorName"],
        issue_date=datetime.utcnow(),
        credential_id=credential_id,
        template_path=certificate["template"]
    )
    
    # Create student certificate record
    student_certificate_data = {
        "certificate_id": certificate["_id"],
        "student_id": ObjectId(student_id),
        "course_id": ObjectId(course_id),
        "issue_date": datetime.utcnow(),
        "completion_date": datetime.utcnow(),
        "credential_id": credential_id,
        "certificate_url": certificate_url,
        "status": "Available"
    }
    
    result = await db.student_certificates.insert_one(student_certificate_data)
    
    # Create notification for student
    notification_data = {
        "title": "Certificate Issued",
        "message": f"You have been issued a certificate for completing '{course['courseName']}'",
        "type": "certificate",
        "recipient_id": ObjectId(student_id),
        "sender_id": ObjectId(current_user.id),
        "course_id": ObjectId(course_id),
        "read": False,
        "created_at": datetime.utcnow()
    }
    
    await db.notifications.insert_one(notification_data)
    
    return {
        "message": "Certificate issued successfully",
        "certificate": {
            "_id": str(result.inserted_id),
            **student_certificate_data,
            "certificate_id": str(student_certificate_data["certificate_id"]),
            "student_id": str(student_certificate_data["student_id"]),
            "course_id": str(student_certificate_data["course_id"])
        }
    }

@router.get("/student", response_model=dict)
async def get_student_certificates(current_user: User = Depends(get_current_student)) -> Any:
    """
    Get all certificates for the current student.
    """
    certificates = []
    cursor = db.student_certificates.find({
        "student_id": ObjectId(current_user.id)
    })
    
    async for cert in cursor:
        # Get course and certificate template details
        course = await db.courses.find_one({"_id": cert["course_id"]})
        template = await db.certificates.find_one({"_id": cert["certificate_id"]})
        
        if course and template:
            cert["_id"] = str(cert["_id"])
            cert["certificate_id"] = str(cert["certificate_id"])
            cert["student_id"] = str(cert["student_id"])
            cert["course_id"] = str(cert["course_id"])
            cert["course"] = {
                "name": course["courseName"],
                "instructor": course["instructorName"]
            }
            cert["title"] = template["title"]
            cert["description"] = template["description"]
            certificates.append(cert)
    
    return {"certificates": certificates}

@router.get("/course/{course_id}", response_model=dict)
async def get_course_certificates(
    course_id: str,
    current_user: User = Depends(get_current_teacher)
) -> Any:
    """
    Get all certificates issued for a course (teacher only).
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
    
    # Get certificate template
    template = await db.certificates.find_one({
        "course_id": ObjectId(course_id)
    })
    
    if not template:
        return {
            "certificate_template": None,
            "issued_certificates": []
        }
    
    # Get issued certificates
    certificates = []
    cursor = db.student_certificates.find({
        "course_id": ObjectId(course_id)
    })
    
    async for cert in cursor:
        # Get student details
        student = await db.users.find_one({"_id": cert["student_id"]})
        
        if student:
            cert["_id"] = str(cert["_id"])
            cert["certificate_id"] = str(cert["certificate_id"])
            cert["student_id"] = str(cert["student_id"])
            cert["course_id"] = str(cert["course_id"])
            cert["student_name"] = student["username"]
            certificates.append(cert)
    
    return {
        "certificate_template": {
            "_id": str(template["_id"]),
            "title": template["title"],
            "description": template["description"],
            "template": template["template"],
            "course_id": str(template["course_id"])
        },
        "issued_certificates": certificates
    }

@router.get("/admin", response_model=dict)
def get_all_certificates(current_user: Any = Depends(get_current_superuser)) -> Any:
    total = db.student_certificates.count_documents({})
    cursor = db.student_certificates.find({})
    
    certificates = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        doc["certificate_id"] = str(doc["certificate_id"])
        doc["student_id"] = str(doc["student_id"])
        doc["course_id"] = str(doc["course_id"])
        certificates.append(doc)

    return {"total": total, "certificates": certificates}