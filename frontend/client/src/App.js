import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Teacher Components
import CourseManagement from "./pages/teacher/components/ManageCourse";
import Dashboard from "./pages/teacher/Dashboard";
import Courses from "./pages/teacher/Courses";
import Students from "./pages/teacher/Students";
import Assignments from "./pages/teacher/Assignments";
import Attendance from "./pages/teacher/Attendance";
import Grades from "./pages/teacher/Grades";
import Materials from "./pages/teacher/Materials";
import Settings from "./pages/teacher/Settings";

// Student Components
import StdDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import NewCourses from "./pages/student/NewCourses";
import Progress from "./pages/student/Progress";
import Certificates from "./pages/student/Certificates";
import StudentAttendance from "./pages/student/Attendance";
import Notifications from "./pages/student/Notifications";
import Support from "./pages/student/Support";
import CourseMaterials from "./pages/student/CourseMaterials";
import LogoutPage from './pages/LogoutPage';
import StudentAssignments from "./pages/student/Assignments";

function App() {
  return (
    <>
      <Routes>
        {/* Other routes */}
        <Route path="/logout" element={<LogoutPage />} />
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Student Routes */}
        <Route
          path="/student-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<StdDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="new-courses" element={<NewCourses />} />
          <Route path="progress" element={<Progress />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<Support />} />
          <Route path="courses/materials" element={<CourseMaterials />} />
        </Route>

        {/* Protected Teacher Routes */}
        <Route
          path="/teacher-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route
            path="courses/:courseId/manage"
            element={<CourseManagement />}
          />
          <Route path="students" element={<Students />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="grades" element={<Grades />} />
          <Route path="materials" element={<Materials />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
