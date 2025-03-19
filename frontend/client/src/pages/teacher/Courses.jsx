import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiBook,
} from "react-icons/fi";
import AddCourseModal from "./components/AddCourseModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCourses(response.data.courses);
        console.log(response.data.courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    activeFilter === "all"
      ? courses
      : courses.filter(
          (course) => course.status.toLowerCase() === activeFilter
        );

  const handleAddCourse = (courseData) => {
    // Here you would typically send the data to your API
    console.log("Form submitted:", courseData);

    // Close modal
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            {/* <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setActiveFilter("all")} 
                className={`px-4 py-2 text-sm ${activeFilter === "all" ? "bg-[#19a4db] text-white" : "bg-white text-gray-700"}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter("active")} 
                className={`px-4 py-2 text-sm ${activeFilter === "active" ? "bg-[#19a4db] text-white" : "bg-white text-gray-700"}`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveFilter("upcoming")} 
                className={`px-4 py-2 text-sm ${activeFilter === "upcoming" ? "bg-[#19a4db] text-white" : "bg-white text-gray-700"}`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setActiveFilter("completed")} 
                className={`px-4 py-2 text-sm ${activeFilter === "completed" ? "bg-[#19a4db] text-white" : "bg-white text-gray-700"}`}
              >
                Completed
              </button>
            </div> */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm"
            >
              <FiPlus className="mr-2" />
              Add Course
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg">{course.courseName}</h3>
              <p className="text-gray-600 mt-1">Code: {course.courseCode}</p>
              <p className="text-gray-500 mt-1 text-sm">
                duration : {course.duration} weeks{" "}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FiUsers className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">
                    {course.maxStudents} students
                  </span>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    course.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() =>
                    navigate(`/teacher-dashboard/courses/${course._id}/manage`)
                  }
                  className="flex justify-center items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium"
                >
                  Manage Course
                </button>
                <button className="flex justify-center items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                  View Materials
                </button>
                <button className="flex justify-center items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                  Student Performance
                </button>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="text-gray-400 w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No Courses Found
              </h3>
              <p className="text-gray-500 mb-4">
                {activeFilter === "all"
                  ? "You haven't created any courses yet."
                  : `You don't have any ${activeFilter} courses.`}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium"
              >
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import the Course Modal Component */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCourse}
      />
    </div>
  );
};

export default Courses;
