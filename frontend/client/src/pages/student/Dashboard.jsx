import React from "react";

const Dashboard = ({ studentName = "Student", courses = [] }) => {
  // Add default values for the props to prevent undefined errors
  
  // Add a safe check before sorting
  const sortedCourses = courses && courses.length > 0 
    ? [...courses].sort((a, b) => {
        // Safely handle missing nextDate
        if (!a.nextDate) return 1;
        if (!b.nextDate) return -1;
        return new Date(a.nextDate) - new Date(b.nextDate);
      })
    : [];
  
  const nextCourse = sortedCourses.length > 0 ? sortedCourses[0] : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Welcome back, {studentName}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Next Class</h3>
            {nextCourse ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold">{nextCourse.title}</h4>
                <p className="text-gray-600 mt-1">With {nextCourse.instructor}</p>
                
                {/* Safely display date information if available */}
                {nextCourse.nextDate && (
                  <p className="text-[#19a4db] mt-3 font-medium">
                    {nextCourse.nextDate}
                    {nextCourse.schedule && 
                      `, ${nextCourse.schedule.split(' ').slice(-2).join(' ')}`
                    }
                  </p>
                )}
                
                {nextCourse.nextLesson && (
                  <p className="text-gray-600 mt-1">Topic: {nextCourse.nextLesson}</p>
                )}
                
                <button className="mt-4 bg-[#19a4db] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Join Class
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-500">No upcoming classes</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Upcoming Deadlines</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium">React Components Assignment</h4>
                    <p className="text-gray-500 text-sm mt-1">Introduction to React</p>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                    Due Tomorrow
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">JavaScript Quiz</h4>
                    <p className="text-gray-500 text-sm mt-1">Advanced JavaScript</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                    Due in 3 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* My Courses Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Courses</h2>
          <button className="text-sm text-[#19a4db] hover:text-[#1582af]">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-gray-600 mt-1">Instructor: {course.instructor}</p>
              <p className="text-gray-500 mt-1 text-sm">{course.schedule}</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#19a4db] h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <p className="text-gray-600">You submitted <span className="font-medium">JavaScript Assignment 2</span></p>
            <p className="text-gray-400 text-sm">2 hours ago</p>
          </div>
          <div className="border-l-4 border-green-400 pl-4 py-1">
            <p className="text-gray-600">You completed <span className="font-medium">Lesson 5: Advanced React Hooks</span></p>
            <p className="text-gray-400 text-sm">Yesterday</p>
          </div>
          <div className="border-l-4 border-purple-400 pl-4 py-1">
            <p className="text-gray-600">You joined <span className="font-medium">Introduction to React live session</span></p>
            <p className="text-gray-400 text-sm">2 days ago</p>
          </div>
          <div className="border-l-4 border-yellow-400 pl-4 py-1">
            <p className="text-gray-600">You received feedback on <span className="font-medium">UI Design Principles Quiz</span></p>
            <p className="text-gray-400 text-sm">3 days ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 