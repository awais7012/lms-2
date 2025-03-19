import React from "react";
import { FiCalendar, FiClock, FiAlertCircle } from "react-icons/fi";

const Attendance = () => {
  // Mock attendance data
  const attendanceStats = {
    overall: 92,
    recentClasses: [
      { date: "May 10", status: "Present", course: "React Fundamentals" },
      { date: "May 8", status: "Present", course: "Advanced JavaScript" },
      { date: "May 6", status: "Absent", course: "React Fundamentals" },
      { date: "May 3", status: "Present", course: "UX/UI Design" },
      { date: "May 1", status: "Present", course: "React Fundamentals" },
      { date: "Apr 28", status: "Present", course: "Advanced JavaScript" },
      { date: "Apr 26", status: "Excused", course: "UX/UI Design" },
    ],
    absences: 3,
    excused: 2,
  };

  // Calculate statistics
  const totalClasses = attendanceStats.recentClasses.length;
  const presentCount = attendanceStats.recentClasses.filter(
    (item) => item.status === "Present"
  ).length;
  const absentCount = attendanceStats.recentClasses.filter(
    (item) => item.status === "Absent"
  ).length;
  const excusedCount = attendanceStats.recentClasses.filter(
    (item) => item.status === "Excused"
  ).length;

  // Current month attendance
  const currentMonthAttendance = [
    { day: 1, status: "Present" },
    { day: 3, status: "Present" },
    { day: 5, status: "Present" },
    { day: 8, status: "Absent" },
    { day: 10, status: "Present" },
    { day: 12, status: "Present" },
    { day: 15, status: "Excused" },
    { day: 17, status: "Present" },
    { day: 19, status: "Present" },
    { day: 22, status: "Present" },
    { day: 24, status: "Present" },
    { day: 26, status: "Present" },
    { day: 29, status: "Present" },
  ];

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Excused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Attendance Record</h1>
      
      {/* Attendance overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Attendance Overview</h2>
        
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eeeeee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3"
                  strokeDasharray={`${attendanceStats.overall}, 100`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                {attendanceStats.overall}%
              </div>
            </div>
            <p className="text-center mt-2 text-gray-700">Overall Attendance</p>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{presentCount}</span>
                <span className="text-sm text-green-600">Present</span>
              </div>
              <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-red-600">{absentCount}</span>
                <span className="text-sm text-red-600">Absent</span>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">{excusedCount}</span>
                <span className="text-sm text-yellow-600">Excused</span>
              </div>
            </div>
          </div>
        </div>
        
        {attendanceStats.absences > 0 && (
          <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800">Attendance Warning</h4>
                <p className="text-red-700 text-sm mt-1">
                  You have {attendanceStats.absences} unexcused {attendanceStats.absences === 1 ? 'absence' : 'absences'}. More than 4 absences may affect your course completion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent attendance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Classes</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceStats.recentClasses.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-2" />
                      {item.date}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {item.course}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Monthly calendar view */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">May 2023</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <FiClock className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {/* First week empty days */}
          {[...Array(3)].map((_, index) => (
            <div key={`empty-${index}`} className="h-12 rounded-md"></div>
          ))}
          
          {/* Calendar days */}
          {[...Array(31)].map((_, i) => {
            const day = i + 1;
            const attendanceRecord = currentMonthAttendance.find(a => a.day === day);
            const hasClass = attendanceRecord !== undefined;
            return (
              <div 
                key={`day-${day}`} 
                className={`h-12 rounded-md flex items-center justify-center ${
                  hasClass ? 'border border-gray-200' : ''
                }`}
              >
                <div className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                  hasClass ? getStatusColor(attendanceRecord.status).replace('text-', 'hover:bg-').replace('-800', '-50') : ''
                }`}>
                  <span className={hasClass ? 'font-medium' : 'text-gray-400'}>
                    {day}
                  </span>
                  {hasClass && (
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      attendanceRecord.status === 'Present' ? 'bg-green-500' : 
                      attendanceRecord.status === 'Absent' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance; 