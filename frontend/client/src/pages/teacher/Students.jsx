import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiMail,
  FiUserCheck,
  FiUserX,
  FiDownload,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:5000/api/courses/teacher/courses",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data.courses || []);

        // After fetching courses, fetch all students for all courses initially
        if (response.data.courses && response.data.courses.length > 0) {
          fetchStudentsForCourse("all");
        } else {
          setLoading(false);
          // If no courses, use mock data as fallback
          setStudents(mockStudents);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
        // If API fails, use mock data as fallback
        setCourses([
          { _id: 1, courseName: "Introduction to React" },
          { _id: 2, courseName: "Advanced JavaScript" },
          { _id: 3, courseName: "UX/UI Design Fundamentals" },
        ]);
        setStudents(mockStudents);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students for a specific course
  const fetchStudentsForCourse = async (courseId) => {
    setLoading(true);
    try {
      if (courseId === "all") {
        // Fetch students for all courses
        const allStudentsPromises = courses.map((course) =>
          axios.get(
            `http://localhost:5000/api/courses/${course._id}/students`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          )
        );

        const responses = await Promise.all(allStudentsPromises);

        // Combine and deduplicate students from all courses
        const allStudents = [];
        const studentIds = new Set();

        responses.forEach((response, index) => {
          const courseStudents = response.data.students || [];
          courseStudents.forEach((student) => {
            if (!studentIds.has(student._id)) {
              studentIds.add(student._id);
              // Add course information to the student
              student.courses = [
                {
                  id: courses[index]._id,
                  name: courses[index].courseName,
                },
              ];
              allStudents.push(student);
            } else {
              // Add this course to the existing student's courses
              const existingStudent = allStudents.find(
                (s) => s._id === student._id
              );
              if (existingStudent) {
                existingStudent.courses.push({
                  id: courses[index]._id,
                  name: courses[index].courseName,
                });
              }
            }
          });
        });

        setStudents(allStudents);
      } else {
        // Fetch students for a specific course
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/students`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        // Add course information to each student
        const courseInfo = courses.find((c) => c._id === courseId);
        const studentsWithCourse = (response.data.students || []).map(
          (student) => ({
            ...student,
            courses: [
              {
                id: courseId,
                name: courseInfo?.courseName || "Unknown Course",
              },
            ],
          })
        );

        setStudents(studentsWithCourse);
      }
    } catch (error) {
      console.error(`Error fetching students for course ${courseId}:`, error);
      // If API fails, use mock data filtered by course
      if (courseId === "all") {
        setStudents(mockStudents);
      } else {
        setStudents(
          mockStudents.filter((student) =>
            student.courses.some((course) => course.id.toString() === courseId)
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection change
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    fetchStudentsForCourse(courseId);
  };

  // Mock student data - used as fallback if API fails
  const mockStudents = [
    {
      _id: "ST-001",
      username: "John Doe",
      email: "john.doe@example.com",
      courses: [
        { id: 1, name: "Introduction to React" },
        { id: 2, name: "Advanced JavaScript" },
      ],
      performance: 85,
      attendance: 92,
      status: "Active",
    },
    {
      _id: "ST-002",
      username: "Jane Smith",
      email: "jane.smith@example.com",
      courses: [{ id: 1, name: "Introduction to React" }],
      performance: 76,
      attendance: 85,
      status: "Active",
    },
    {
      _id: "ST-003",
      username: "Michael Brown",
      email: "michael.brown@example.com",
      courses: [
        { id: 2, name: "Advanced JavaScript" },
        { id: 3, name: "UX/UI Design Fundamentals" },
      ],
      performance: 92,
      attendance: 95,
      status: "Active",
    },
    {
      _id: "ST-004",
      username: "Emily Wilson",
      email: "emily.wilson@example.com",
      courses: [
        { id: 1, name: "Introduction to React" },
        { id: 3, name: "UX/UI Design Fundamentals" },
      ],
      performance: 68,
      attendance: 78,
      status: "At Risk",
    },
    {
      _id: "ST-005",
      username: "David Chen",
      email: "david.chen@example.com",
      courses: [{ id: 2, name: "Advanced JavaScript" }],
      performance: 90,
      attendance: 88,
      status: "Active",
    },
  ];

  // Filter students based on search
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student._id?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle opening the email modal
  const handleOpenEmailModal = (student) => {
    setSelectedStudent(student);
    setEmailModalOpen(true);
  };

  // Handle sending the email
  const handleSendEmail = (e) => {
    e.preventDefault();

    // In a real app, you would call an API to send the email
    console.log(
      `Sending email to ${selectedStudent.username} (${selectedStudent.email})`
    );
    console.log(`Message: ${emailMessage}`);

    // Show success message (in a real app, this would happen after API success)
    alert(`Email sent to ${selectedStudent.username}`);

    // Close modal and reset form
    setEmailModalOpen(false);
    setEmailMessage("");
    setSelectedStudent(null);
  };

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19a4db]"></div>
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
                            {student.username?.charAt(0) || "?"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.username || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.courses?.map((course, idx) => (
                            <span key={idx} className="inline-block mr-1">
                              {course.name}
                              {idx < (student.courses?.length || 0) - 1
                                ? ","
                                : ""}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.courses?.length || 0} total
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 h-full rounded-full ${
                                (student.performance || 0) >= 80
                                  ? "bg-green-500"
                                  : (student.performance || 0) >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${student.performance || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {student.performance || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`absolute left-0 h-full rounded-full ${
                                (student.attendance || 0) >= 85
                                  ? "bg-green-500"
                                  : (student.attendance || 0) >= 75
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${student.attendance || 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {student.attendance || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            student.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : student.status === "At Risk"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-gray-400 hover:text-[#19a4db]"
                            onClick={() => handleOpenEmailModal(student)}
                          >
                            <FiMail size={18} />
                          </button>
                          <button className="text-gray-400 hover:text-[#19a4db]">
                            <FiMoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No students found matching your search criteria.
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
                  {selectedStudent.username?.charAt(0) || "?"}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">
                    {selectedStudent.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="Enter email subject"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#19a4db] text-white rounded-md text-sm"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
