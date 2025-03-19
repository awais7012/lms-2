import React, { useState, useEffect } from "react";
import { FiClock, FiUser, FiCalendar, FiBookOpen, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

const NewCourses = () => {
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCourses, setNewCourses] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/courses/getallcourses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setNewCourses(response.data.courses);
      } catch (error) {
        toast.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollCourse = async (courseId) => {
    setEnrollingCourseId(courseId);
    console.log("Enrolling in course", courseId);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/courses/enroll`,
        { courseId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        toast.success("Successfully enrolled in the course!");
      }
    } catch (error) {
      if (error.response) {
        // Handle specific error responses from the server
        if (error.response.status === 400) {
          toast.error("Already enrolled or Course full");
        } else if (error.response.status === 404) {
          toast.error("Student not found.");
        } else {
          toast.error("Server error. Please try again later.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const openCourseDetailsModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeCourseDetailsModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">New Available Courses</h2>

        {newCourses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No New Courses Available
            </h3>
            <p className="text-gray-500">
              Check back later for new course offerings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {newCourses.map((course) => (
              <div
                key={course._id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="font-bold text-lg">{course.courseName}</h3>
                    <p className="text-gray-600 mt-1">
                      <FiUser className="inline-block mr-2" />
                      Instructor: {course.instructorName}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <div className="bg-green-100 px-3 py-1 rounded-lg text-sm mb-2 text-green-800">
                      {course.enrollmentStatus}
                    </div>

                    <p className="text-gray-600 font-medium">
                      Price : {course.price} PKR
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Course Description</h4>
                  <p className="text-gray-600">{course.description}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEnrollCourse(course._id)}
                    className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium flex items-center"
                    disabled={enrollingCourseId === course._id}
                  >
                    {enrollingCourseId === course._id ? (
                      <>
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Enrolling...
                      </>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                  <button
                    onClick={() => openCourseDetailsModal(course)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCourse.title}
                </h2>
                <button
                  onClick={closeCourseDetailsModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Instructor Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instructor</h3>
                  <p className="flex items-center text-gray-700">
                    <FiUser className="mr-2" />
                    {selectedCourse.instructorName}
                  </p>
                </div>

                {/* Course Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Course Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Enrollment Status</p>
                      <p className="font-medium">
                        {selectedCourse.enrollmentStatus}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Students Enrolled</p>
                      <p className="font-medium">
                        {selectedCourse.studentsEnrolled}
                      </p>
                    </div>
                    {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg col-span-full">
                        <p className="text-sm text-gray-500">Categories</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedCourse.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>

                {/* Course Content/Syllabus - Would be included if available */}
                {selectedCourse.syllabus && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Syllabus</h3>
                    <ul className="space-y-3">
                      {selectedCourse.syllabus.map((item, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {item.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}


                {/* Enrollment Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleEnrollCourse(selectedCourse._id);
                      closeCourseDetailsModal();
                    }}
                    className="w-full px-4 py-3 bg-[#19a4db] text-white rounded-lg font-medium"
                  >
                    Enroll in this Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCourses;
