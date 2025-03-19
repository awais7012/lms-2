import os
import uuid
from fastapi import UploadFile
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

async def save_upload(upload_file: UploadFile, folder: str) -> str:
    """
    Save an uploaded file to the specified folder.
    Returns the relative path to the saved file.
    """
    try:
        # Create folder if it doesn't exist
        folder_path = os.path.join(settings.UPLOAD_FOLDER, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Save file
        file_path = os.path.join(folder_path, unique_filename)
        
        # Read file content
        contents = await upload_file.read()
        
        # Write to file
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Return relative path
        return os.path.join(folder, unique_filename)
    
    except Exception as e:
        logger.error(f"Error saving file: {e}")
        raise e

