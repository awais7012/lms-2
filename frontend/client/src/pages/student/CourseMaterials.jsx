import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CourseMaterials = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeModules, setActiveModules] = useState({});
  const courseId = location.state?.courseId;

  useEffect(() => {
    if (courseId) {
      // Fetch course details using courseId
      const fetchCourseDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/courses/${courseId}/modules`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          setCourse(response);
          console.log("course", response.data.modules);

          // Fetch course modules
          const fetchModules = async () => {
            try {
              const response = await axios.get(
                `http://localhost:8000/api/courses/${courseId}/modules`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );
              setModules(response.data.modules);
            } catch (error) {
              console.error("Failed to fetch course modules", error);
            }
          };

          fetchModules();
        } catch (error) {
          console.error("Failed to fetch course details", error);
        }
      };

      fetchCourseDetails();
    } else {
      console.log("No course ID found in navigation state");
    }
  }, [courseId]);

  const toggleModule = (moduleId) => {
    setActiveModules((prevState) => ({
      ...prevState,
      [moduleId]: !prevState[moduleId],
    }));
  };

  if (!course) {
    return (
      <div className="p-6 bg-white shadow-md rounded-xl">
        <p className="text-gray-500">Loading course materials...</p>
        <button
          onClick={() => navigate("/student-dashboard/courses")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>

      <p className="text-gray-600 mb-6">Instructor: {course.instructor}</p>

      {/* Tabs similar to the image */}
      <div className="flex border-b mb-6">
        <div className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
          Course Content
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Modules / Sections</h3>
      </div>

      <div className="space-y-4">
        {modules && modules.length > 0 ? (
          modules.map((module) => (
            <div key={module._id} className="border rounded-lg overflow-hidden">
              {/* Module header - clickable to expand/collapse */}
              <div
                className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer"
                onClick={() => toggleModule(module._id)}
              >
                <div className="flex items-center">
                  <span
                    className={`mr-2 transition-transform ${
                      activeModules[module._id] ? "transform rotate-90" : ""
                    }`}
                  >
                    ▶
                  </span>
                  <span className="font-medium">{module.title}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {module.lessons.length}{" "}
                    {module.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </div>
              </div>

              {/* Lessons - visible when module is expanded */}
              {activeModules[module._id] && (
                <div className="divide-y">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="p-4 pl-8 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-400">•</span>
                        <span>{lesson.title}</span>
                      </div>
                        <span className="text-sm text-gray-500">
                              {lesson.materialType === "link" ? (
                                <a
                                  href={lesson.materialUrl.startsWith("http") ? lesson.materialUrl : `https://${lesson.materialUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  View now!
                                </a>
                              ) : (
                                ""
                              )}
                            </span>
                      <span className="text-sm text-gray-500">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 border rounded-lg">
            <p>No modules added to this course yet.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/student-dashboard/courses")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Back to Courses
      </button>
    </div>
  );
};

export default CourseMaterials;
