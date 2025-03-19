FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create upload directory
RUN mkdir -p uploads/profile_pictures uploads/course_thumbnails uploads/course_materials \
    uploads/assignment_files uploads/assignment_submissions uploads/certificate_templates \
    uploads/certificates

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

