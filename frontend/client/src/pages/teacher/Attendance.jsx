import { useState, useEffect } from "react"
import { FiCalendar, FiSearch, FiDownload, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi"
import axios from "axios";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [studentAttendance, setStudentAttendance] = useState({})
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/api/courses/teacher/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        const data = response.data;
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        alert("Failed to load courses. Please try again.");
      }
    };
    
    fetchCourses();    
  }, [])

  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/api/courses/${selectedCourse}/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const data = response.data;
        setStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to load students. Please try again.");
      }
    };
    
    fetchStudents();
    
  }, [selectedCourse])

  // Fetch attendance data when course or date changes
  useEffect(() => {
    if (!selectedCourse) return;
  
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/api/attendance/course/${selectedCourse}?start_date=${selectedDate}&end_date=${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Map attendance records to our format
        const records = response.data.attendance_records || [];
        setAttendanceData(
          records.map((record) => ({
            _id: record._id,
            student_id: record.student_id,
            student_name: record.student_name,
            status: record.status,
            time: record.time || "",
            note: record.note || "",
            date: record.date,
          }))
        );
  
        // Initialize student attendance for taking attendance
        const initialAttendance = {};
        students.forEach((student) => {
          const existingRecord = records.find((r) => r.student_id === student._id);
          initialAttendance[student._id] = existingRecord
            ? {
                status: existingRecord.status,
                time: existingRecord.time || "",
                note: existingRecord.note || "",
              }
            : {
                status: "Present",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                note: "",
              };
        });
  
        setStudentAttendance(initialAttendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        alert("Failed to load attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendance();
  }, [selectedCourse, selectedDate, students]);
  

  const handleTakeAttendance = () => {
    // Initialize attendance for all students
    const initialAttendance = {}
    students.forEach((student) => {
      const existingRecord = attendanceData.find((record) => record.student_id === student._id)
      if (existingRecord) {
        initialAttendance[student._id] = {
          status: existingRecord.status,
          time: existingRecord.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          note: existingRecord.note || "",
        }
      } else {
        initialAttendance[student._id] = {
          status: "Present",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          note: "",
        }
      }
    })
    setStudentAttendance(initialAttendance)
    setIsDialogOpen(true)
  }

  const handleStatusChange = (studentId, status) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  const handleNoteChange = (studentId, note) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }))
  }

  const handleSubmitAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
  
      // Prepare records for bulk submission
      const records = Object.entries(studentAttendance).map(([studentId, data]) => ({
        student_id: studentId,
        status: data.status,
        time: data.time,
        note: data.note,
      }));
  
      // Submit attendance records
      await axios.post(
        `${BASE_URL}/api/attendance/bulk-record`,
        {
          course_id: selectedCourse,
          date: selectedDate,
          records,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Attendance recorded successfully");
  
      // Refresh attendance data
      const attendanceResponse = await axios.get(
        `${BASE_URL}/api/attendance/course/${selectedCourse}?start_date=${selectedDate}&end_date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setAttendanceData(attendanceResponse.data.attendance_records || []);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Failed to record attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const exportAttendance = () => {
    // Create CSV content
    const headers = ["Student ID", "Student Name", "Status", "Time", "Note"]
    const rows = attendanceData.map((record) => [
      record.student_id,
      record.student_name,
      record.status,
      record.time || "-",
      record.note || "-",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `attendance-${selectedCourse}-${selectedDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FiCheckCircle className="text-green-500 w-5 h-5" />
      case "Absent":
        return <FiXCircle className="text-red-500 w-5 h-5" />
      case "Late":
        return <FiAlertCircle className="text-yellow-500 w-5 h-5" />
      default:
        return null
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter attendance data based on search query
  const filteredAttendanceData = attendanceData.filter((record) =>
    record.student_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate statistics
  const presentCount = attendanceData.filter((record) => record.status === "Present").length
  const absentCount = attendanceData.filter((record) => record.status === "Absent").length
  const lateCount = attendanceData.filter((record) => record.status === "Late").length
  const attendanceRate = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Attendance</h2>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm"
              onClick={exportAttendance}
            >
              <FiDownload className="mr-2" />
              Export
            </button>
            <button
              className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm"
              onClick={handleTakeAttendance}
            >
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
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{presentCount}</div>
            <div className="text-sm text-green-600">Present</div>
          </div>

          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{absentCount}</div>
            <div className="text-sm text-red-600">Absent</div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{lateCount}</div>
            <div className="text-sm text-yellow-600">Late</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{attendanceRate}%</div>
            <div className="text-sm text-blue-600">Attendance Rate</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#19a4db]"></div>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No attendance records found for this date. Click "Take Attendance" to record attendance.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendanceData.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium">
                          {record.student_name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{record.student_name}</div>
                          <div className="text-xs text-gray-500">{record.student_id}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.time || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Take Attendance Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Take Attendance</h3>
              <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>

            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium">
                            {(student.full_name || student.username).charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.full_name || student.username}
                            </div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent appearance-none"
                          value={studentAttendance[student._id]?.status || "Present"}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Excused">Excused</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Add note (optional)"
                          className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                          value={studentAttendance[student._id]?.note || ""}
                          onChange={(e) => handleNoteChange(student._id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm"
                onClick={handleSubmitAttendance}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance

