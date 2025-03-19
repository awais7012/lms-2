import React from "react";
import { FiBell, FiMail, FiLogOut } from "react-icons/fi"
import Logo from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
const StudentHeader = ({ notifications = [], studentName = "Guest" }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center">
        <img src={Logo} alt="EduLearn" className="h-12 -my-1" />
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <button className="p-2 text-gray-500 hover:text-[#19a4db] rounded-full hover:bg-gray-100">
            <FiBell />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Icon */}
        <div className="relative">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#19a4db] rounded-full flex items-center justify-center text-white font-medium">
              {studentName.trim() ? studentName.charAt(0).toUpperCase() : "G"}
            </div>
            <span className="text-sm text-gray-700 hidden md:block">
              {studentName.trim() || "Guest"}
            </span>
          </button>
        </div>
        <div className="relative">
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 flex items-center space-x-1"
                    title="Logout"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="text-sm hidden md:block">Logout</span>
                  </button>
          </div>
      </div>
    </header>
  );
};

export default StudentHeader;
