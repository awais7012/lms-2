import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiUsers,
  FiPieChart,
  FiAward,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiClipboard,
  FiShield,
} from "react-icons/fi";
import AuthContext from "../context/AuthContext";

const Sidebar = ({ isSidebarOpen, navigate }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext); // Access logout from AuthContext

  const isActive = (path) => {
    return location.pathname === `/dashboard${path}`;
  };

  const handleLogout = () => {
    logout(); // Clear tokens and user data
    navigate("/login"); // Redirect to login
  };

  return (
    <aside
      className={`bg-white shadow-lg z-20 fixed inset-y-0 left-0 transition-all duration-300 transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:sticky lg:top-16 lg:translate-x-0 lg:h-[calc(100vh-4rem)] pt-16 lg:pt-0`}
      style={{ width: "250px" }}
    >
      <div className="flex flex-col h-full py-4 px-3">
        <nav className="space-y-1 px-2">
          <Link
            to="/dashboard"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiHome className="mr-3 h-5 w-5" />
            Dashboard Overview
          </Link>

          <Link
            to="/dashboard/courses"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/courses")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiBook className="mr-3 h-5 w-5" />
            Course Management
          </Link>

          {/* <Link
            to="/dashboard/scheduling"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/scheduling")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            Scheduling & Planning
          </Link> */}

          <Link
            to="/dashboard/students"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/students")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Student Management
          </Link>

          <Link
            to="/dashboard/teachers"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/teachers")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiUsers className="mr-3 h-5 w-5" />
            Teacher Management
          </Link>

          <Link
            to="/dashboard/communications"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/communications")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiMessageSquare className="mr-3 h-5 w-5" />
            Communications
          </Link>

          <Link
            to="/dashboard/attendance"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/attendance")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiClipboard className="mr-3 h-5 w-5" />
            Attendance & Evaluations
          </Link>

          <Link
            to="/dashboard/certifications"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/certifications")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiAward className="mr-3 h-5 w-5" />
            Certifications
          </Link>


          <Link
            to="/dashboard/settings"
            className={`flex items-center px-4 py-3 text-sm rounded-lg ${
              isActive("/settings")
                ? "bg-[#19a4db] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout} // Handle logout on click
              className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FiLogOut className="mr-3 h-10 w-5" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
