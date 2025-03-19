import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  console.log("in course page");
  // Load courses data
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/courses/enrolled`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCourses(response.data.courses);
        console.log(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  // const handleViewMaterials = (courseId) => {
  //   // Store the selected course ID in sessionStorage
  //   sessionStorage.setItem('selectedCourseId', courseId);
  //   navigate("/student-dashboard/courses/materials");
  // };
  const handleViewMaterials = (courseId) => {
    console.log("clicked view materials");
    navigate("/student-dashboard/courses/materials", { state: { courseId } });
  };

  if (loading) {
    return (
      <p className="text-gray-600 text-center mt-10">Loading courses...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -5 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-bold text-lg">{course.courseName}</h3>
                    <p className="text-gray-600 mt-1">
                      Instructor: {course.instructorName}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {course.category}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {course.duration} Weeks Course
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <div className="w-full md:w-64 mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                    Continue Learning
                  </button> */}
                  <button
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                    onClick={() => handleViewMaterials(course._id)}
                  >
                    View Materials
                  </button>
                  {/* <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                    Discussion Forum
                  </button> */}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
