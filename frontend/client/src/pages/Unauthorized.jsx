import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext" 

const Unauthorized = () => {
  const navigate = useNavigate()
  const { logout, role } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const handleGoBack = () => {
    // Redirect based on role or go back to previous page
    if (role === "student") {
      navigate("/student-dashboard")
    } else if (role === "teacher") {
      navigate("/teacher-dashboard")
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          {/* Error Icon - using emoji instead of lucide icon */}
          <div className="w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <span className="text-3xl">🛡️</span>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>

          {/* Alert Icon and Message - using emoji instead of lucide icon */}
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-md mb-6">
            <span>⚠️</span>
            <p className="text-sm">You don't have permission to access this page</p>
          </div>

          {/* Error Description */}
          <p className="text-gray-600 text-center mb-8">
            It seems you're trying to access a page that requires different permissions. Please contact your
            administrator if you believe this is an error.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleGoBack}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 font-medium"
            >
              Go Back
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <span>🚪</span> {/* Logout emoji instead of lucide icon */}
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
        If you need assistance, please contact support
      </div>
    </div>
  )
}

export default Unauthorized

