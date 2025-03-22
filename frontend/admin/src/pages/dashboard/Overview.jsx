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

      // Fetch students and teachers concurrently
      const [studentsResult, teachersResult] = await Promise.allSettled([
        axios.get(`${baseUrl}/api/users`, { ...config, params: { role: 'student' } }),
        axios.get(`${baseUrl}/api/users`, { ...config, params: { role: 'teacher' } }),
      ]);
      
      // Substitute with empty arrays if a call failed
      const studentsRes = studentsResult.status === 'fulfilled' ? studentsResult.value : { data: { users: [] } };
      const teachersRes = teachersResult.status === 'fulfilled' ? teachersResult.value : { data: { users: [] } };

      const totalStudents = Array.isArray(studentsRes.data.users) ? studentsRes.data.users.length : 0;
      const totalTeachers = Array.isArray(teachersRes.data.users) ? teachersRes.data.users.length : 0;
      
      const pendingStudents = (studentsRes.data.users || []).filter(user => !user.is_active);
      const pendingTeachers = (teachersRes.data.users || []).filter(user => !user.is_active);
      const pendingApprovals = pendingStudents.length + pendingTeachers.length;
      
      const statsData = {
        totalStudents,
        totalTeachers,
        pendingApprovals,
        // For upcomingClasses and certificatesIssued, we leave them undefined or set defaults
        upcomingClasses: stats && stats.upcomingClasses ? stats.upcomingClasses : 0,
        todayClassesInfo: stats && stats.todayClassesInfo ? stats.todayClassesInfo : '',
        certificatesIssued: stats && stats.certificatesIssued ? stats.certificatesIssued : 0,
        certificatesIssuedChange: stats && stats.certificatesIssuedChange ? stats.certificatesIssuedChange : '',
      };

      setStats(statsData);
      
      // If you have registrations and schedule APIs later, update these here.
      setRecentRegistrations([]); // default empty
      setUpcomingSchedule([]);    // default empty

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
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Teachers</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalTeachers}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Approvals</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.pendingApprovals}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiBell className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        { /* Upcoming Classes Section – left as is */ }
        {/* { <div className="bg-white rounded-xl shadow-sm p-6">
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
        </div> } */}
        
        { /* Certificates Issued Section – left as is */ }
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
            { /* Notifications section remains as is */ }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
