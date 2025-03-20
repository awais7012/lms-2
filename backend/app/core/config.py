import secrets
from typing import Any, Dict, List, Optional, Union
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, validator

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000","http://localhost:3001"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "lms_db"
    
    # Email settings
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = "smtp.gmail.com"
    SMTP_USER: Optional[str] = ""
    SMTP_PASSWORD: Optional[str] = ""
    EMAILS_FROM_EMAIL: Optional[EmailStr] = "info@example.com"
    EMAILS_FROM_NAME: Optional[str] = "LMS System"
    
    # Admin user
    FIRST_SUPERUSER_EMAIL: EmailStr = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = "admin123"
    
    # Upload settings
    UPLOAD_FOLDER: str = "uploads"
    MAX_UPLOAD_SIZE: int = 20 * 1024 * 1024  # 20 MB
    
    # JWT settings
    JWT_ALGORITHM: str = "HS256"
    
    # Project name
    PROJECT_NAME: str = "Learning Management System API"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

