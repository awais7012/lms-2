import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiTrash2,
  FiUsers,
  FiCalendar,
  FiBook,
  FiEye
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/courses/teacher/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };
  const filteredCourses = courses.filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleViewCourse = (id) => {
    navigate(`/dashboard/course/${id}`);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        {/* <button 
          onClick={handleAddCourse}
          className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
        >
          <FiPlus className="mr-2" />
          Add New Course
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Total Courses
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {courses.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiBook className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Upcoming</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {courses.filter((c) => c.status === "upcoming").length}
              </h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiCalendar className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Total Students
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {courses.reduce(
                  (sum, course) => sum + (course.enrolledStudents || 0),
                  0
                )}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FiUsers className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-6">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19a4db]"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                <img
                  src={
                    course.thumbnail ||
                    `https://via.placeholder.com/150/19a4db/FFFFFF?text=${
                      course.courseName?.charAt(0) || "C"
                    }`
                  }
                  alt={course.courseName || "Course"}
                  className="w-full h-full object-cover absolute mix-blend-overlay"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === "active"
                        ? "bg-green-100 text-green-800"
                        : course.status === "upcoming"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {course.status === "active"
                      ? "Active"
                      : course.status === "upcoming"
                      ? "Upcoming"
                      : "Completed"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">
                  {course.courseName || "Untitled Course"}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  {course.category || "Uncategorized"}
                </p>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="font-medium">Instructor:</span>
                  <span className="ml-2">
                    {course.instructorName || "Not assigned"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Enrolled</span>
                    <span className="font-semibold flex items-center">
                      <FiUsers className="mr-1 text-[#19a4db]" />
                      {course.enrolledStudents || 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-semibold flex items-center">
                      <FiCalendar className="mr-1 text-[#19a4db]" />
                      {course.duration || "N/A"}
                    </span>
                  </div>
                </div>

                {course.status !== "upcoming" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#19a4db] h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleViewCourse(course._id)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    <FiEye className="inline-block mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
              <FiBook className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No Courses Found
            </h3>
            <p className="text-gray-500">
              Try changing your search criteria or add a new course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
