import { useState, useEffect } from "react"
import { FiCalendar, FiAlertCircle, FiLoader } from "react-icons/fi"
import axios from "axios"

const BASE_URL = process.env.REACT_APP_API_URLL || "http://localhost:8000"

// Create axios instance with auth header
const api = axios.create({
  baseURL: BASE_URL,
})

// Add request interceptor to include token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const Attendance = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const fetchAttendanceData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch student attendance data
      const response = await api.get("api/attendance/student")

      // Process the data
      const { attendance_records, statistics } = response.data

      // Format the data for our component
      const formattedData = {
        overall: statistics.attendance_rate,
        recentClasses: attendance_records
          .map((record) => ({
            date: new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            status: record.status,
            course: record.course_name,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 7),
        absences: statistics.absent,
        excused: statistics.excused,
        currentMonthAttendance: formatMonthlyAttendance(attendance_records),
      }

      setAttendanceData(formattedData)
    } catch (err) {
      console.error("Error fetching attendance data:", err)
      setError("Failed to load attendance data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Format attendance records for the calendar view
  const formatMonthlyAttendance = (records) => {
    const monthlyData = []

    records.forEach((record) => {
      const recordDate = new Date(record.date)
      if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
        monthlyData.push({
          day: recordDate.getDate(),
          status: record.status,
        })
      }
    })

    return monthlyData
  }

  // Calculate statistics
  const calculateStats = () => {
    if (!attendanceData) return { totalClasses: 0, presentCount: 0, absentCount: 0, excusedCount: 0 }

    const totalClasses = attendanceData.recentClasses.length
    const presentCount = attendanceData.recentClasses.filter((item) => item.status === "Present").length
    const absentCount = attendanceData.recentClasses.filter((item) => item.status === "Absent").length
    const excusedCount = attendanceData.recentClasses.filter((item) => item.status === "Excused").length

    return { totalClasses, presentCount, absentCount, excusedCount }
  }

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Excused":
        return "bg-yellow-100 text-yellow-800"
      case "Late":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get month name
  const getMonthName = (month) => {
    const date = new Date()
    date.setMonth(month)
    return date.toLocaleString("default", { month: "long" })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-gray-600">Loading attendance data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FiAlertCircle className="text-red-500 text-4xl mx-auto mb-4" />
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchAttendanceData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  // If no data yet
  if (!attendanceData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-700">No attendance data available.</p>
      </div>
    )
  }

  const { totalClasses, presentCount, absentCount, excusedCount } = calculateStats()

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
                  strokeDasharray={`${attendanceData.overall}, 100`}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                {Math.round(attendanceData.overall)}%
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

        {attendanceData.absences > 0 && (
          <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800">Attendance Warning</h4>
                <p className="text-red-700 text-sm mt-1">
                  You have {attendanceData.absences} unexcused {attendanceData.absences === 1 ? "absence" : "absences"}.
                  More than 4 absences may affect your course completion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent attendance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">Recent Classes</h2>

        {attendanceData.recentClasses.length > 0 ? (
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
                {attendanceData.recentClasses.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{item.course}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No recent classes found.</p>
        )}
      </div>

      {/* Monthly calendar view */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => {
                const newMonth = currentMonth - 1
                if (newMonth < 0) {
                  setCurrentMonth(11)
                  setCurrentYear(currentYear - 1)
                } else {
                  setCurrentMonth(newMonth)
                }
              }}
            >
              &lt;
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              onClick={() => {
                const newMonth = currentMonth + 1
                if (newMonth > 11) {
                  setCurrentMonth(0)
                  setCurrentYear(currentYear + 1)
                } else {
                  setCurrentMonth(newMonth)
                }
              }}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}

          {/* Calculate first day of month offset */}
          {(() => {
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
            const days = []

            // Empty cells for days before the 1st of the month
            for (let i = 0; i < firstDayOfMonth; i++) {
              days.push(<div key={`empty-${i}`} className="h-12 rounded-md"></div>)
            }

            // Calendar days
            for (let day = 1; day <= daysInMonth; day++) {
              const attendanceRecord = attendanceData.currentMonthAttendance.find((a) => a.day === day)
              const hasClass = attendanceRecord !== undefined

              days.push(
                <div
                  key={`day-${day}`}
                  className={`h-12 rounded-md flex items-center justify-center ${
                    hasClass ? "border border-gray-200" : ""
                  }`}
                >
                  <div
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
                      hasClass
                        ? getStatusColor(attendanceRecord.status).replace("text-", "hover:bg-").replace("-800", "-50")
                        : ""
                    }`}
                  >
                    <span className={hasClass ? "font-medium" : "text-gray-400"}>{day}</span>
                    {hasClass && (
                      <div
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          attendanceRecord.status === "Present"
                            ? "bg-green-500"
                            : attendanceRecord.status === "Absent"
                              ? "bg-red-500"
                              : attendanceRecord.status === "Late"
                                ? "bg-orange-500"
                                : "bg-yellow-500"
                        }`}
                      ></div>
                    )}
                  </div>
                </div>,
              )
            }

            return days
          })()}
        </div>
      </div>
    </div>
  )
}

export default Attendance

