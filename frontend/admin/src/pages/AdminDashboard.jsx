import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

// Import components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

// Import subpages
import Overview from "./dashboard/Overview";
import Courses from "./dashboard/Courses";
import Scheduling from "./dashboard/Scheduling";
import Students from "./dashboard/Students";
import Teachers from "./dashboard/Teachers";
import Communications from "./dashboard/Communications";
import Attendance from "./dashboard/Attendance";
import Certifications from "./dashboard/Certifications";
import Settings from "./dashboard/Settings";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Mock notification data
  const notifications = [
    { id: 1, type: 'registration', message: 'New student registration: Maya Rodriguez', time: '2 hours ago' },
    { id: 2, type: 'course', message: 'Course "React Fundamentals" is at 90% capacity', time: '3 hours ago' },
    { id: 3, type: 'system', message: 'System update scheduled for tonight at 2 AM', time: '5 hours ago' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Component */}
      <Header 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
        notifications={notifications} 
      />
      
      {/* Add padding to account for fixed header */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar Component */}
        <Sidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/scheduling" element={<Scheduling />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/communications" element={<Communications />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 