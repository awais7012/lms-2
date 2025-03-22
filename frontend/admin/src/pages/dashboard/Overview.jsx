import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiBookOpen, 
  FiCalendar, 
  FiBell, 
  FiCheckCircle 
} from 'react-icons/fi';
import axios from 'axios';

// Get backend URL from .env
const baseUrl = process.env.REACT_APP_API_URL;

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in first.");
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Use Promise.allSettled so that if one API call fails, others still return.
      const results = await Promise.allSettled([
        axios.get(`${baseUrl}/api/users`, { ...config, params: { role: 'student' } }),
        axios.get(`${baseUrl}/api/users`, { ...config, params: { role: 'teacher' } }),
        axios.get(`${baseUrl}/api/courses/admin/all`, config),
        axios.get(`${baseUrl}/api/dashboard/registrations`, config),
        axios.get(`${baseUrl}/api/dashboard/schedule`, config),
      ]);

      // For any call that failed, we substitute with a default empty response.
      const studentsRes = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
      const teachersRes = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
      const coursesRes = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
      const regsRes = results[3].status === 'fulfilled' ? results[3].value : { data: { registrations: [] } };
      const scheduleRes = results[4].status === 'fulfilled' ? results[4].value : { data: { schedule: [] } };

      const statsData = {
        totalStudents: Array.isArray(studentsRes.data) ? studentsRes.data.length : 0,
        totalTeachers: Array.isArray(teachersRes.data) ? teachersRes.data.length : 0,
        totalCourses: Array.isArray(coursesRes.data) ? coursesRes.data.length : 0,
        // You can add additional properties if your regsRes or scheduleRes contain more stats.
      };

      setStats(statsData);
      setRecentRegistrations(regsRes.data.registrations || []);
      setUpcomingSchedule(scheduleRes.data.schedule || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading dashboard data...
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1582af] transition-colors text-sm font-medium"
            onClick={fetchDashboardData}
          >
            Refresh
          </button>
          <button 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            onClick={() => window.print()} // Replace with your export logic if needed
          >
            Export Data
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Students</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents}</h3>
              {stats.totalStudentsChange && (
                <p className="text-green-500 text-xs font-medium mt-2">
                  {stats.totalStudentsChange}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Courses</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalCourses}</h3>
              {stats.activeCoursesChange && (
                <p className="text-green-500 text-xs font-medium mt-2">
                  {stats.activeCoursesChange}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiBookOpen className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Teachers</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalTeachers}</h3>
              {stats.totalTeachersChange && (
                <p className="text-green-500 text-xs font-medium mt-2">
                  {stats.totalTeachersChange}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        {/* <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.pendingApprovals}</h3>
              {stats.pendingApprovalsInfo && (
                <p className="text-yellow-500 text-xs font-medium mt-2">
                  {stats.pendingApprovalsInfo}
                </p>
              )}
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiBell className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div> */}
        
        {/* <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Today's Classes</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.upcomingClasses}</h3>
              {stats.todayClassesInfo && (
                <p className="text-blue-500 text-xs font-medium mt-2">
                  {stats.todayClassesInfo}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiCalendar className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div> */}
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Certificates Issued</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.certificatesIssued}</h3>
              {stats.certificatesIssuedChange && (
                <p className="text-green-500 text-xs font-medium mt-2">
                  {stats.certificatesIssuedChange}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Student Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Recent Student Registrations</h2>
            <button className="text-sm text-[#19a4db] hover:text-[#1582af]">
              View All
            </button>
          </div>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#6dc9f1] flex items-center justify-center text-white font-medium">
                          {registration.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{registration.name}</p>
                          <p className="text-xs text-gray-500">{registration.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {registration.date}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        registration.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#19a4db] hover:text-[#1582af]">
                        {registration.status === 'Pending' ? 'Approve' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Upcoming Schedule */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Today's Schedule</h2>
            <button className="text-sm text-[#19a4db] hover:text-[#1582af]">View Calendar</button>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {upcomingSchedule.filter(s => s.date === 'Today').map((schedule) => (
                <div key={schedule.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{schedule.course}</h3>
                      <p className="text-sm text-gray-600 mt-1">Instructor: {schedule.instructor}</p>
                      <p className="text-sm text-gray-500 mt-1">{schedule.location}</p>
                    </div>
                    <div className="bg-blue-50 text-[#19a4db] px-3 py-1 rounded-lg text-sm font-medium">
                      {schedule.time}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="text-xs bg-[#19a4db] text-white px-3 py-1 rounded">
                      View Details
                    </button>
                    <button className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded">
                      Send Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* System Notifications */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-lg text-gray-800">System Notifications</h2>
          </div>
          <div className="p-4">
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`border-l-4 p-4 rounded-r-lg ${
                    notification.type === 'update'
                      ? 'border-yellow-400 bg-yellow-50'
                      : notification.type === 'feature'
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-green-400 bg-green-50'
                  }`}
                >
                  <h3 className="font-medium text-gray-800">{notification.title}</h3>
                  <p className="text-sm mt-1 text-gray-700">{notification.message}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
