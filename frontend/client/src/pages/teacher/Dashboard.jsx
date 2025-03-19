import React from "react";
import { FiUsers, FiBook, FiClipboard, FiCalendar } from "react-icons/fi";

const Dashboard = ({ teacherName, courses, upcomingClasses, pendingAssignments }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Welcome back, {teacherName}!</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Courses</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{courses?.length || ""}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiBook className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-600 font-medium">Students</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {/* {courses.reduce((total, course) => total + course.studentsCount, 0)} */}
                  {courses?.reduce((total, course) => total + course.studentsCount, 0)}
                </h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FiUsers className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Assignments</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{pendingAssignments?.length || ""}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiClipboard className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-600 font-medium">3 Upcoming Courses</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  {upcomingClasses?.filter(c => {
                    const today = new Date();
                    const classDate = new Date(c.date);
                    return classDate.toDateString() === today.toDateString();
                  }).length}
                </h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiCalendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
            <div className="space-y-3">
              {upcomingClasses?.slice(0, 3).map((cls, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{cls.courseName}</h4>
                      <p className="text-gray-600 mt-1">Topic: {cls.topic}</p>
                    </div>
                    <div className="bg-blue-100 px-3 py-1 rounded-lg text-blue-800 text-xs font-medium">
                      {cls.time}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{cls.studentsCount} students</span>
                    </div>
                    <button className="px-3 py-1 bg-[#19a4db] text-white rounded-lg text-sm">
                      Start Class
                    </button>
                  </div>
                </div>
              ))}
              {upcomingClasses?.length > 3 && (
                <button className="w-full text-center text-sm text-[#19a4db] hover:text-[#1582af] py-2">
                  View All Classes
                </button>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Pending Assignments</h3>
            <div className="space-y-3">
              {pendingAssignments?.slice(0, 3).map((assignment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{assignment.title}</h4>
                      <p className="text-gray-600 mt-1">{assignment.courseName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      assignment.submissionCount >= assignment.totalStudents / 2
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {assignment.submissionCount}/{assignment.totalStudents} Submitted
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Due: {assignment.dueDate}</span>
                    <button className="px-3 py-1 bg-[#19a4db] text-white rounded-lg text-sm">
                      Review
                    </button>
                  </div>
                </div>
              ))}
              {pendingAssignments?.length > 3 && (
                <button className="w-full text-center text-sm text-[#19a4db] hover:text-[#1582af] py-2">
                  View All Assignments
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
          <button className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm">
            Add New Course
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg">{course.name}</h3>
              <p className="text-gray-600 mt-1">Code: {course.code}</p>
              <p className="text-gray-500 mt-1 text-sm">{course.schedule}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FiUsers className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{course.studentsCount} students</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  course.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {course.status}
                </span>
              </div>
              
              <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium">
                Manage Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 