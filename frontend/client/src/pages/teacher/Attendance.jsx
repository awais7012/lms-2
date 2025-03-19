import React, { useState } from "react";
import { FiCalendar, FiSearch, FiDownload, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState("1");
  
  // Mock courses
  const courses = [
    { id: "1", name: "Introduction to React" },
    { id: "2", name: "Advanced JavaScript" },
    { id: "3", name: "UX/UI Design Fundamentals" }
  ];
  
  // Mock attendance data - would come from API in real app
  const attendanceData = [
    { id: 1, studentId: "ST-001", studentName: "John Doe", status: "Present", time: "09:05 AM", note: "" },
    { id: 2, studentId: "ST-002", studentName: "Jane Smith", status: "Present", time: "09:01 AM", note: "" },
    { id: 3, studentId: "ST-003", studentName: "Michael Brown", status: "Absent", time: "", note: "Sick leave" },
    { id: 4, studentId: "ST-004", studentName: "Emily Wilson", status: "Late", time: "09:20 AM", note: "Traffic" },
    { id: 5, studentId: "ST-005", studentName: "David Chen", status: "Present", time: "08:58 AM", note: "" },
    { id: 6, studentId: "ST-006", studentName: "Sarah Miller", status: "Present", time: "09:03 AM", note: "" },
    { id: 7, studentId: "ST-007", studentName: "Robert Johnson", status: "Absent", time: "", note: "Family emergency" },
    { id: 8, studentId: "ST-008", studentName: "Lisa Wang", status: "Present", time: "09:07 AM", note: "" }
  ];
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FiCheckCircle className="text-green-500 w-5 h-5" />;
      case "Absent":
        return <FiXCircle className="text-red-500 w-5 h-5" />;
      case "Late":
        return <FiAlertCircle className="text-yellow-500 w-5 h-5" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Attendance</h2>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">
              <FiDownload className="mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm">
              Take Attendance
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center space-y-4 md:space-y-0 mb-6">
          <div className="w-full md:w-1/3 md:pr-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/3 md:px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent appearance-none"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3 md:pl-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {attendanceData.filter(record => record.status === "Present").length}
            </div>
            <div className="text-sm text-green-600">Present</div>
          </div>
          
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {attendanceData.filter(record => record.status === "Absent").length}
            </div>
            <div className="text-sm text-red-600">Absent</div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {attendanceData.filter(record => record.status === "Late").length}
            </div>
            <div className="text-sm text-yellow-600">Late</div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Math.round((attendanceData.filter(record => record.status === "Present").length / attendanceData.length) * 100)}%
            </div>
            <div className="text-sm text-blue-600">Attendance Rate</div>
          </div>
        </div>
        
        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium">
                        {record.studentName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                        <div className="text-xs text-gray-500">{record.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.time || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance; 