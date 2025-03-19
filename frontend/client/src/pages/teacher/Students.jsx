import { useState, useEffect } from "react"
import axios from "axios"
import { FiSearch, FiFilter, FiMail, FiMoreVertical, FiX, FiLoader, FiAlertCircle } from "react-icons/fi"

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

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

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [emailMessage, setEmailMessage] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  // Fetch teacher's courses
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch courses using the API
      const response = await api.get("/api/courses/teacher/courses")
      const coursesData = response.data.courses || []
      setCourses(coursesData)

      // After fetching courses, fetch all students for all courses initially
      if (coursesData.length > 0) {
        await fetchStudentsForCourse("all", coursesData)
      } else {
        setStudents([])
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses. Please try again later.")
      setCourses([])
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch students for a specific course
  const fetchStudentsForCourse = async (courseId, coursesData = courses) => {
    setLoading(true)
    setError(null)

    try {
      if (courseId === "all") {
        // Fetch students for all courses
        const allStudentsPromises = coursesData.map((course) => api.get(`/api/courses/${course._id}/students`))

        const responses = await Promise.all(allStudentsPromises)

        // Combine and deduplicate students from all courses
        const allStudents = []
        const studentIds = new Set()

        responses.forEach((response, index) => {
          const courseStudents = response.data.students || []
          courseStudents.forEach((student) => {
            if (!studentIds.has(student._id)) {
              studentIds.add(student._id)
              // Add course information to the student
              student.courses = [
                {
                  id: coursesData[index]._id,
                  name: coursesData[index].courseName,
                },
              ]
              allStudents.push(student)
            } else {
              // Add this course to the existing student's courses
              const existingStudent = allStudents.find((s) => s._id === student._id)
              if (existingStudent) {
                existingStudent.courses.push({
                  id: coursesData[index]._id,
                  name: coursesData[index].courseName,
                })
              }
            }
          })
        })

        setStudents(allStudents)
      } else {
        // Fetch students for a specific course
        const response = await api.get(`/api/courses/${courseId}/students`)

        // Add course information to each student
        const courseInfo = coursesData.find((c) => c._id === courseId)
        const studentsWithCourse = (response.data.students || []).map((student) => ({
          ...student,
          courses: [
            {
              id: courseId,
              name: courseInfo?.courseName || "Unknown Course",
            },
          ],
        }))

        setStudents(studentsWithCourse)
      }
    } catch (err) {
      console.error(`Error fetching students for course ${courseId}:`, err)
      setError(`Failed to load students for the selected course. Please try again later.`)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  // Handle course selection change
  const handleCourseChange = (e) => {
    const courseId = e.target.value
    setSelectedCourse(courseId)
    fetchStudentsForCourse(courseId)
  }

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.full_name && student.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  // Handle opening the email modal
  const handleOpenEmailModal = (student) => {
    setSelectedStudent(student)
    setEmailModalOpen(true)
    setEmailSubject("")
    setEmailMessage("")
  }

  // Handle sending the email
  const handleSendEmail = async (e) => {
    e.preventDefault()

    try {
      setSendingEmail(true)

      // In a real app, you would call an API to send the email
      // For example:
      // await api.post("/messages/send", {
      //   recipient_id: selectedStudent._id,
      //   subject: emailSubject,
      //   message: emailMessage
      // });

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      alert(`Email sent to ${selectedStudent.username || selectedStudent.full_name}`)

      // Close modal and reset form
      setEmailModalOpen(false)
      setEmailMessage("")
      setEmailSubject("")
      setSelectedStudent(null)
    } catch (err) {
      console.error("Error sending email:", err)
      alert("Failed to send email. Please try again.")
    } finally {
      setSendingEmail(false)
    }
  }

  // Get status color based on student status
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "At Risk":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get performance color based on score
  const getPerformanceColor = (score) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get attendance color based on percentage
  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "bg-green-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6 w-full">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Students</h2>
          <div className="flex mt-4 sm:mt-0 space-x-2">
            {/* <button className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm">
              <FiDownload className="mr-2" />
              Export Data
            </button> */}
          </div>
        </div>

        <div className="flex flex-wrap items-center space-y-4 md:space-y-0 mb-6">
          <div className="w-full md:w-1/2 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/2 md:pl-4 flex space-x-2">
            <div className="relative w-full">
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent appearance-none"
                value={selectedCourse}
                onChange={handleCourseChange}
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700">{error}</p>
                <button onClick={() => fetchCourses()} className="mt-2 text-sm text-red-700 underline">
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <FiLoader className="animate-spin h-12 w-12 text-[#19a4db] mb-4" />
              <p className="text-gray-500">Loading students data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Courses
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Performance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium">
                            {(student.full_name || student.username || "?").charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.full_name || student.username || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.courses?.map((course, idx) => (
                            <span key={idx} className="inline-block mr-1">
                              {course.name}
                              {idx < (student.courses?.length || 0) - 1 ? "," : ""}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">{student.courses?.length || 0} total</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 h-full rounded-full ${getPerformanceColor(student.performance || 0)}`}
                              style={{ width: `${student.performance || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{student.performance || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 h-full rounded-full ${getAttendanceColor(student.attendance || 0)}`}
                              style={{ width: `${student.attendance || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{student.attendance || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(student.status || "Unknown")}`}
                        >
                          {student.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-gray-400 hover:text-[#19a4db]"
                            onClick={() => handleOpenEmailModal(student)}
                            title="Send Email"
                          >
                            <FiMail size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-[#19a4db]" title="More Options">
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                      {error ? "Error loading students data." : "No students found matching your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setEmailModalOpen(false)}
            >
              <FiX size={24} />
            </button>

            <h3 className="text-xl font-bold mb-4">Send Email</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">To:</p>
              <div className="flex items-center mt-1">
                <div className="h-8 w-8 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium text-sm">
                  {(selectedStudent.full_name || selectedStudent.username || "?").charAt(0)}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{selectedStudent.full_name || selectedStudent.username}</p>
                  <p className="text-xs text-gray-500">{selectedStudent.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] min-h-[120px]"
                  placeholder="Type your message here..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm"
                  onClick={() => setEmailModalOpen(false)}
                  disabled={sendingEmail}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#19a4db] text-white rounded-md text-sm flex items-center"
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Email"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students

