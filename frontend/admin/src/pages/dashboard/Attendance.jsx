import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiPieChart } from 'react-icons/fi';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse !== 'all') {
      fetchAttendance(selectedCourse, selectedDate);
    }
  }, [selectedCourse, selectedDate]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/courses/teacher/courses');
      const data = await response.json();
      setCourses([{ id: 'all', name: 'All Courses' }, ...data.courses]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAttendance = async (courseId, date) => {
    try {
      const response = await fetch(`/attendance/course/${courseId}?start_date=${date}&end_date=${date}`);
      const data = await response.json();
      setAttendanceRecords(data.attendance_records || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const stats = {
    presentRate: 0,
    absentRate: 0,
    lateRate: 0,
    excusedRate: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  };

  const filteredRecords = attendanceRecords;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheckCircle className="text-green-500" />;
      case 'absent':
        return <FiXCircle className="text-red-500" />;
      case 'late':
        return <FiClock className="text-yellow-500" />;
      case 'excused':
        return <FiAlertCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  const handleExportData = () => {
    alert('Export functionality not implemented yet.');
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance & Evaluations</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Present Rate</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.presentRate}%</h3>
              <p className="text-green-500 text-xs font-medium mt-2">{stats.present} students</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Absent Rate</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.absentRate}%</h3>
              <p className="text-red-500 text-xs font-medium mt-2">{stats.absent} students</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiXCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Late Arrivals</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.lateRate}%</h3>
              <p className="text-yellow-500 text-xs font-medium mt-2">{stats.late} students</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Excused Absences</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.excusedRate}%</h3>
              <p className="text-blue-500 text-xs font-medium mt-2">{stats.excused} students</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiAlertCircle className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'overview' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'records' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('records')}
          >
            Attendance Records
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'trends' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            Attendance Trends
          </button>
        </div>
        
        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or course"
                className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <FiDownload className="inline-block mr-2" />
            Export
          </button>
        </div>
        
        {/* Overview tab content */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Class Attendance Summary</h3>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-4">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-4" style={{ width: `${stats.presentRate}%` }}></div>
                  <div className="bg-yellow-500 h-4" style={{ width: `${stats.lateRate}%` }}></div>
                  <div className="bg-blue-500 h-4" style={{ width: `${stats.excusedRate}%` }}></div>
                  <div className="bg-red-500 h-4" style={{ width: `${stats.absentRate}%` }}></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Present ({stats.presentRate}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>Late ({stats.lateRate}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Excused ({stats.excusedRate}%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Absent ({stats.absentRate}%)</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance by Course</h3>
              <div className="min-w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Present
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Introduction to React
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        75%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        15%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        10%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Advanced JavaScript
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        85%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        10%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        5%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        UX/UI Design Fundamentals
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        70%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        20%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        10%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Records tab content */}
        {activeTab === 'records' && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arrival Time
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                        <div className="text-sm text-gray-500">{record.studentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className={`ml-2 capitalize ${
                            record.status === 'present' ? 'text-green-800' :
                            record.status === 'absent' ? 'text-red-800' :
                            record.status === 'late' ? 'text-yellow-800' : 'text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.arrivalTime || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#19a4db] hover:text-[#1582af]">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Trends tab content */}
        {activeTab === 'trends' && (
          <div>
            <div className="text-center py-8">
              <div className="inline-block p-8 bg-gray-50 rounded-lg">
                <FiPieChart className="h-16 w-16 text-gray-400 mx-auto" />
                <h3 className="mt-4 font-medium text-gray-800">Attendance Trend Graphs</h3>
                <p className="mt-2 text-gray-500 max-w-md">
                  Charts and graphs showing attendance patterns over time will appear here. The data visualization is currently being developed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance; 