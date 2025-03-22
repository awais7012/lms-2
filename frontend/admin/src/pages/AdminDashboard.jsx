import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:8000/api/notifications", {
          withCredentials: true,
        },{Headers: {
          Authorization: `Bearer ${token}`,
        }});
        setNotifications(res.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
        notifications={notifications} 
      />
      <div className="flex flex-1 pt-16">
        <Sidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
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
