
---

# E-Learning LMS Platform

An advanced Learning Management System (LMS) built with **FastAPI** on the backend and **React** on the frontend. This platform supports three types of users—**Admin**, **Teacher**, and **Student**—and provides comprehensive features for course management, assignments, attendance tracking, grading, and more.

---

## Features

### User Roles
1. **Admin**
   - Manage users (create, update, delete).
   - Oversee courses and assignments.
   - Access system-wide reports and analytics.
2. **Teacher**
   - Create and manage courses.
   - Create, assign, and grade assignments.
   - Mark and track student attendance.
   - Review student performance reports.
3. **Student**
   - Enroll in courses.
   - Submit assignments.
   - View grades and feedback.
   - Monitor attendance and progress.

### Core Functionalities
- **Course Management**: Create, update, and delete courses; assign teachers and students.
- **Assignment System**: Enable teachers to create assignments and grade student submissions.
- **Attendance Tracking**: Allow teachers to mark and monitor student attendance.
- **Grading System**: Facilitate the assignment of grades for assignments and exams, with a clear interface for student feedback.
- **User Authentication**: Secure login with role-based access control.
- **Reports and Analytics**: Generate detailed reports on attendance, grades, and overall performance.
- **Certificates**: Automatically generate and issue certificates to students upon course completion.

---

## Tech Stack

### Backend
- **FastAPI**: A modern, fast (high-performance) web framework for building APIs.
- **Database**: MongoDB
- **Authentication**: JWT-based authentication for secure access.
- **Dependencies**:
  - `uvicorn==0.22.0`
  - `motor==3.5.1`
  - `pydantic==1.10.21`
  - `pydantic_core==2.27.2`
  - `pymongo==4.8.0`
  - `python-jose==3.3.0`
  - `passlib==1.7.4`
  - `python-multipart==0.0.6`
  - `email-validator==2.0.0`
  - `python-dotenv==1.0.0`
  - `bcrypt==4.0.1`
  - **Authlib**: Please ensure you install the correct version if you face any compatibility issues with FastAPI.

> **Troubleshooting FastAPI Issues:**  
> If you encounter errors while running FastAPI, double-check that the installed package versions match those listed above. Misaligned versions can lead to unexpected errors. Also, verify that your environment is correctly set up with Python 3.9+.

### Frontend
- **React**: A robust framework for building dynamic user interfaces.
- **Installation Note**: Simply run `npm install` to install dependencies and `npm start` to launch the development server.

### Deployment
- **Server**: Deployable on popular cloud platforms like AWS, Azure, or Heroku.
- **Containerization**: The project is Dockerized for easy deployment and scalability.

---

## Installation

### Prerequisites
- **Python 3.9+**
- **MongoDB**
- **Docker** (optional for containerization)
- **Node.js and npm** (for frontend development)

### Setup Instructions

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/mE-uMAr/E-learning-LMS.git
   cd E-learning-LMS
   ```

2. **Backend Setup:**
   - Create a virtual environment and install dependencies:
     ```sh
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     pip install -r requirements.txt
     ```
   - **MongoDB Setup:**  
     Create a database and configure your connection by updating the `.env` file with the proper credentials and database URL.

   - **Run the Backend:**
     ```sh
     python ./backend/main.py
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory (if separate) and install dependencies:
     ```sh
     npm install
     npm start
     ```

---

## Contributing

Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to your branch.
5. Open a pull request.

Please ensure your code follows the project’s coding standards and includes appropriate tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---


