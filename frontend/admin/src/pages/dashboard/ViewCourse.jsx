import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBook,
  FiUsers,
  FiCalendar,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const ViewCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // In a real app, this would be an API call
        // For now, using mock data
        const mockCourses = [
          {
            id: "CRS-001",
            title: "Introduction to React",
            category: "Web Development",
            instructor: "Dr. Amita Verma",
            duration: "8 weeks",
            enrolledStudents: 42,
            startDate: "2023-06-15",
            status: "active",
            progress: 65,
            thumbnail:
              "https://via.placeholder.com/150/19a4db/FFFFFF?text=React",
            description:
              "Learn the fundamentals of React, including components, props, state, and more.",
            modules: [
              {
                title: "Getting Started with React",
                lessons: [
                  "Introduction to React",
                  "Setting Up Your Environment",
                  "Your First React Component",
                ],
              },
              {
                title: "React Fundamentals",
                lessons: [
                  "Components and Props",
                  "State and Lifecycle",
                  "Handling Events",
                ],
              },
              {
                title: "Advanced React",
                lessons: [
                  "Hooks",
                  "Context API",
                  "Error Boundaries",
                  "Performance Optimization",
                ],
              },
            ],
          },
          {
            id: "CRS-002",
            title: "Advanced JavaScript",
            category: "Programming",
            instructor: "Prof. Aryan Shah",
            duration: "10 weeks",
            enrolledStudents: 38,
            startDate: "2023-06-10",
            status: "active",
            progress: 70,
            thumbnail: "https://via.placeholder.com/150/f9ca24/000000?text=JS",
            description:
              "Master advanced JavaScript concepts and become a proficient JS developer.",
            modules: [
              {
                title: "Advanced JavaScript Concepts",
                lessons: [
                  "Closures",
                  "Prototypes",
                  "ES6+ Features",
                  "Async Programming",
                ],
              },
              {
                title: "JavaScript Design Patterns",
                lessons: [
                  "Module Pattern",
                  "Factory Pattern",
                  "Observer Pattern",
                  "Singleton Pattern",
                ],
              },
              {
                title: "Performance Optimization",
                lessons: [
                  "Memory Management",
                  "JavaScript Engine Internals",
                  "Optimization Techniques",
                ],
              },
            ],
          },
          {
            id: "CRS-003",
            title: "UX/UI Design Fundamentals",
            category: "Design",
            instructor: "Dr. Nandini Gupta",
            duration: "6 weeks",
            enrolledStudents: 35,
            startDate: "2023-07-01",
            status: "upcoming",
            progress: 0,
            thumbnail: "https://via.placeholder.com/150/6c5ce7/FFFFFF?text=UX",
            description:
              "Learn essential principles of UX/UI design and create beautiful user interfaces.",
            modules: [
              {
                title: "UX Fundamentals",
                lessons: [
                  "User Research",
                  "Information Architecture",
                  "Wireframing",
                  "Prototyping",
                ],
              },
              {
                title: "UI Design Principles",
                lessons: [
                  "Color Theory",
                  "Typography",
                  "Visual Hierarchy",
                  "Design Systems",
                ],
              },
              {
                title: "Design Tools",
                lessons: [
                  "Figma Basics",
                  "Advanced Figma Techniques",
                  "Adobe XD",
                  "Sketch",
                ],
              },
            ],
          },
        ];

        const foundCourse = mockCourses.find((c) => c.id === id);
        setCourse(foundCourse || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          notifications={[]}
        />
        <div className="flex flex-1">
          <Sidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
          <main className="flex-1 p-4 pt-20 lg:ml-[250px]">
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Not found state
  if (!course) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          notifications={[]}
        />
        <div className="flex flex-1">
          <Sidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
          <main className="flex-1 p-4 pt-20 lg:ml-[250px]">
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-700">
                Course not found
              </h2>
              <p className="mt-2 text-gray-500">
                We couldn't find the course you're looking for.
              </p>
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="mt-6 px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Back to Courses
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Main content - course found
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        notifications={notifications || []}
      />
      <div className="flex flex-1">
        <Sidebar isSidebarOpen={isSidebarOpen} navigate={navigate} />
        <main className="flex-1 pt-20 lg:ml-[250px]">
          <div className="p-4">
            {/* Back Button */}
            <button
              onClick={() => navigate("/dashboard/courses")}
              className="flex items-center mb-4 text-gray-600 hover:text-[#19a4db] transition-colors"
            >
              <FiArrowLeft className="mr-2" /> Back to Courses
            </button>

            {/* Course Banner Image */}
            <div className="bg-white">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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

            {/* Course Header */}
            <div className="bg-white px-6 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {course.title}
              </h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>

            {/* Course Info Grid */}
            <div className="bg-white px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FiBook className="text-[#19a4db]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{course.category}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FiUsers className="text-[#19a4db]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="font-medium">{course.enrolledStudents}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FiCalendar className="text-[#19a4db]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(course.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FiClock className="text-[#19a4db]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
            </div>

            {/* Instructor Section */}
            <div className="bg-white px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold mb-3">Instructor</h2>
              <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                  {course.instructor
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-gray-500">Senior Instructor</p>
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="bg-white px-6 py-4">
              <h2 className="text-lg font-semibold mb-3">Course Content</h2>
              <div className="space-y-3">
                {course.modules?.map((module, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-2 font-medium flex items-center justify-between">
                      <span>{module.title}</span>
                      <span className="text-sm text-gray-500">
                        {module.lessons.length} lessons
                      </span>
                    </div>
                    <div className="p-3">
                      <ul className="space-y-1">
                        {module.lessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-start">
                            <FiCheckCircle className="text-[#19a4db] mt-1 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewCourse;
