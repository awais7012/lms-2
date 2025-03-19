import os
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def generate_certificate(
    student_name: str,
    course_name: str,
    certificate_title: str,
    instructor_name: str,
    issue_date: datetime,
    credential_id: str,
    template_path: str = None
) -> str:
    """
    Generate a certificate image and save it.
    Returns the path to the generated certificate.
    """
    try:
        # Create certificates folder if it doesn't exist
        certificates_folder = os.path.join(settings.UPLOAD_FOLDER, "certificates")
        os.makedirs(certificates_folder, exist_ok=True)
        
        # Generate unique filename
        filename = f"{credential_id}.png"
        file_path = os.path.join(certificates_folder, filename)
        
        # Use template if provided, otherwise create a blank certificate
        if template_path and os.path.exists(os.path.join(settings.UPLOAD_FOLDER, template_path)):
            img = Image.open(os.path.join(settings.UPLOAD_FOLDER, template_path))
        else:
            # Create a blank certificate
            img = Image.new('RGB', (1200, 900), color=(255, 255, 255))
            draw = ImageDraw.Draw(img)
            
            # Add border
            draw.rectangle([(20, 20), (1180, 880)], outline=(25, 164, 219), width=5)
            
            # Add header
            try:
                header_font = ImageFont.truetype("arial.ttf", 60)
            except IOError:
                header_font = ImageFont.load_default()
            
            draw.text((600, 100), "Certificate of Completion", fill=(25, 164, 219), font=header_font, anchor="mm")
            
            # Add certificate title
            try:
                title_font = ImageFont.truetype("arial.ttf", 40)
            except IOError:
                title_font = ImageFont.load_default()
            
            draw.text((600, 200), certificate_title, fill=(0, 0, 0), font=title_font, anchor="mm")
            
            # Add student name
            try:
                name_font = ImageFont.truetype("arial.ttf", 50)
            except IOError:
                name_font = ImageFont.load_default()
            
            draw.text((600, 350), student_name, fill=(0, 0, 0), font=name_font, anchor="mm")
            
            # Add course name
            try:
                course_font = ImageFont.truetype("arial.ttf", 30)
            except IOError:
                course_font = ImageFont.load_default()
            
            draw.text((600, 450), f"has successfully completed the course", fill=(0, 0, 0), font=course_font, anchor="mm")
            draw.text((600, 500), course_name, fill=(0, 0, 0), font=course_font, anchor="mm")
            
            # Add date and instructor
            try:
                details_font = ImageFont.truetype("arial.ttf", 25)
            except IOError:
                details_font = ImageFont.load_default()
            
            draw.text((300, 650), f"Issue Date: {issue_date.strftime('%B %d, %Y')}", fill=(0, 0, 0), font=details_font, anchor="mm")
            draw.text((900, 650), f"Instructor: {instructor_name}", fill=(0, 0, 0), font=details_font, anchor="mm")
            
            # Add credential ID
            try:
                id_font = ImageFont.truetype("arial.ttf", 20)
            except IOError:
                id_font = ImageFont.load_default()
            
            draw.text((600, 800), f"Credential ID: {credential_id}", fill=(0, 0, 0), font=id_font, anchor="mm")
        
        # Save the certificate
        img.save(file_path)
        
        # Return relative path
        return os.path.join("certificates", filename)
    
    except Exception as e:
        logger.error(f"Error generating certificate: {e}")
        raise e

