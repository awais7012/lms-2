import React from "react";
import { Outlet } from "react-router-dom";
import TeacherHeader from "../components/TeacherHeader";
import TeacherSidebar from "../components/TeacherSidebar";

const TeacherDashboard = () => {
  // Mock data for notifications
  const notifications = [
    { id: 1, type: 'message', text: 'New message from student', time: '10m ago' },
    { id: 2, type: 'alert', text: 'Assignment submissions ready for review', time: '1h ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <TeacherHeader 
        notifications={notifications} 
        teacherName="Dr. Jane Smith" 
      />
      
      {/* Main content with fixed sidebar */}
      <div className="pt-16 flex">
        {/* Fixed width sidebar */}
        <div className="w-64 flex-shrink-0">
          <TeacherSidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-grow p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 