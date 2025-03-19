import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";

const TeacherSidebar = () => {
  const location = useLocation(); // Get current route

  // Function to check if a tab is active
  const isActive = (path) => location.pathname.startsWith(path);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <aside className="bg-white shadow-lg h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex flex-col h-full py-6 px-4">
        <nav className="flex-1 space-y-2">
          <Link
            to="/teacher-dashboard"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard") && !isActive("/teacher-dashboard/")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/teacher-dashboard/courses"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/courses")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiBook className="mr-3 h-5 w-5" />
            My Courses
          </Link>

          <Link
            to="/teacher-dashboard/students"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/students")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Students
          </Link>

          <Link
            to="/teacher-dashboard/assignments"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/assignments")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiClipboard className="mr-3 h-5 w-5" />
            Assignments
          </Link>

          <Link
            to="/teacher-dashboard/attendance"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/attendance")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            Attendance
          </Link>

          {/* <Link
            to="/teacher-dashboard/grades"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/grades")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCheckSquare className="mr-3 h-5 w-5" />
            Grades
          </Link> */}

          {/* <Link
            to="/teacher-dashboard/materials"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/materials")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiFileText className="mr-3 h-5 w-5" />
            Course Materials
          </Link> */}

          <Link
            to="/teacher-dashboard/settings"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/teacher-dashboard/settings")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={() => handleLogout()}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
