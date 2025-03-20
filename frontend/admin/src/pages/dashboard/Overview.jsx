import React from 'react';
import { FiUsers, FiBookOpen, FiCalendar, FiBell, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

const Overview = () => {
  // Mock data - would come from API in a real application
  const stats = {
    totalStudents: 843,
    totalTeachers: 47,
    activeCourses: 26,
    pendingApprovals: 12,
    upcomingClasses: 8,
    certificatesIssued: 312
  };

  const recentRegistrations = [
    { id: 1, name: 'Maya Rodriguez', email: 'maya.r@example.com', date: '2023-05-12', status: 'Pending' },
    { id: 2, name: 'John Chen', email: 'john.c@example.com', date: '2023-05-11', status: 'Approved' },
    { id: 3, name: 'Sarah Wilson', email: 'sarah.w@example.com', date: '2023-05-11', status: 'Approved' },
    { id: 4, name: 'Raj Patel', email: 'raj.p@example.com', date: '2023-05-10', status: 'Pending' },
  ];

  const upcomingSchedule = [
    { id: 1, course: 'React Fundamentals', instructor: 'Dr. Michael Lee', date: 'Today', time: '10:00 AM - 12:00 PM', location: 'Room 101' },
    { id: 2, course: 'Advanced JavaScript', instructor: 'Sarah Johnson', date: 'Today', time: '2:00 PM - 4:00 PM', location: 'Online' },
    { id: 3, course: 'UX/UI Design', instructor: 'Emma Thompson', date: 'Tomorrow', time: '9:00 AM - 11:00 AM', location: 'Design Lab' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1582af] transition-colors text-sm font-medium">
            Export Data
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Refresh
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
              <p className="text-green-500 text-xs font-medium mt-2">↑ 12% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Active Courses</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.activeCourses}</h3>
              <p className="text-green-500 text-xs font-medium mt-2">↑ 5% from last month</p>
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
              <p className="text-green-500 text-xs font-medium mt-2">↑ 3% from last month</p>
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
              <p className="text-yellow-500 text-xs font-medium mt-2">Requires attention</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiBell className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Today's Classes</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.upcomingClasses}</h3>
              <p className="text-blue-500 text-xs font-medium mt-2">View schedule</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiCalendar className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Certificates Issued</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.certificatesIssued}</h3>
              <p className="text-green-500 text-xs font-medium mt-2">↑ 8% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-[#19a4db]" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-800">Recent Student Registrations</h2>
            <button className="text-sm text-[#19a4db] hover:text-[#1582af]">View All</button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
                <h3 className="font-medium text-yellow-800">System Update</h3>
                <p className="text-sm text-yellow-700 mt-1">Scheduled maintenance tonight at 2 AM. The system will be unavailable for approximately 30 minutes.</p>
              </div>
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                <h3 className="font-medium text-blue-800">New Feature</h3>
                <p className="text-sm text-blue-700 mt-1">WhatsApp integration is now available. You can send class reminders via WhatsApp.</p>
              </div>
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h3 className="font-medium text-green-800">Performance</h3>
                <p className="text-sm text-green-700 mt-1">This month's student satisfaction rating is 94%, up 3% from last month.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 