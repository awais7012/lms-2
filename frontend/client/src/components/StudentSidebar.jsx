import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMessageSquare,
  FiBook,
  FiClock,
  FiBell,
  FiAward,
  FiUsers,
  FiClipboard,
  FiPlusCircle,
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // Import useAuth for logout
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route path

  // Function to check if a tab is active
  const isActive = (path) => location.pathname === path;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again!");
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg sticky top-16 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full py-6 px-4">
        <nav className="flex-1 space-y-2">
          <Link
            to="/student-dashboard"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/student-dashboard/courses"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/courses")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiBook className="mr-3 h-5 w-5" />
            My Courses
          </Link>

          <Link
            to="/student-dashboard/new-courses"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/new-courses")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiPlusCircle className="mr-3 h-5 w-5" />
            New Courses
          </Link>

          {/* <Link
            to="/student-dashboard/progress"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/progress")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiClock className="mr-3 h-5 w-5" />
            Learning Progress
          </Link> */}
          <Link
                      to="/student-dashboard/assignments"
                      className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
                        isActive("/student-dashboard/assignments")
                          ? "bg-[#19a4db] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <FiClipboard className="mr-3 h-5 w-5" />
                      Assignments
                    </Link>

          <Link
            to="/student-dashboard/certificates"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/certificates")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiAward className="mr-3 h-5 w-5" />
            Certificates
          </Link>

          <Link
            to="/student-dashboard/attendance"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/attendance")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            Attendance
          </Link>

          <Link
            to="/student-dashboard/notifications"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/notifications")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiBell className="mr-3 h-5 w-5" />
            Notifications
          </Link>

          <Link
            to="/student-dashboard/support"
            className={`flex items-center w-full px-4 py-3 text-sm rounded-lg ${
              isActive("/student-dashboard/support")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiMessageSquare className="mr-3 h-5 w-5" />
            Support & Help
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
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

export default StudentSidebar;
