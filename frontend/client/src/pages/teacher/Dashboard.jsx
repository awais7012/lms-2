import React from "react";
import { FiUsers, FiBook, FiClipboard, FiCalendar, FiSettings, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";

const Dashboard = ({ teacherName, courses, upcomingClasses, pendingAssignments }) => {
  const teacherRoutes = [
    { name: "Courses", path: "/teacher-dashboard/courses", icon: <FiBook className="h-8 w-8 text-blue-500" /> },
    { name: "Students", path: "/teacher-dashboard/students", icon: <FiUsers className="h-8 w-8 text-green-500" /> },
    { name: "Assignments", path: "/teacher-dashboard/assignments", icon: <FiClipboard className="h-8 w-8 text-yellow-500" /> },
    { name: "Attendance", path: "/teacher-dashboard/attendance", icon: <FiCalendar className="h-8 w-8 text-purple-500" /> },
    { name: "Settings", path: "/teacher-dashboard/settings", icon: <FiSettings className="h-8 w-8 text-gray-500" /> },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">Welcome back, {teacherName}!</h2>
        <p className="text-lg text-gray-600 text-center mb-8">Manage your courses, students, and assignments efficiently with your personalized LMS dashboard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teacherRoutes.map((route, index) => (
            <Link
              key={index}
              to={route.path}
              className="block bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-transform transform hover:-translate-y-2 border-t-4 border-blue-500 flex flex-col items-center space-y-4 hover:border-blue-600"
            >
              <div className="bg-blue-100 p-5 rounded-full flex items-center justify-center">
                {route.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center">{route.name}</h3>
              <p className="text-sm text-gray-500 text-center">Quick access to {route.name.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;