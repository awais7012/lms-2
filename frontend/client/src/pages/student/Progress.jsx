import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const Progress = () => {
  // Mock data for course progress
  const courses = [
    {
      id: 1,
      title: "Introduction to React",
      instructor: "Sarah Johnson",
      progress: 65,
      score: 78,
      completed: 12,
      total: 20
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Michael Chen",
      progress: 40,
      score: 85,
      completed: 8,
      total: 15
    },
    {
      id: 3,
      title: "UX/UI Design Fundamentals",
      instructor: "Priya Sharma",
      progress: 85,
      score: 92,
      completed: 15,
      total: 18
    },
  ];

  // Calculate overall progress
  const totalCompleted = courses.reduce((sum, course) => sum + course.completed, 0);
  const totalLessons = courses.reduce((sum, course) => sum + course.total, 0);
  const overallProgress = Math.round((totalCompleted / totalLessons) * 100);

  // Generate weekly activity data
  const weeklyActivity = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 2.0 },
    { day: "Fri", hours: 1.5 },
    { day: "Sat", hours: 0.5 },
    { day: "Sun", hours: 1.0 },
  ];

  // Course completion data for the chart
  const courseChartData = courses.map(course => ({
    name: course.title.length > 15 ? course.title.substring(0, 15) + "..." : course.title,
    progress: course.progress
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Learning Progress</h1>
      
      {/* Overall progress card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Overall Progress</h2>
        <div className="flex items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eeeeee"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4299e1"
                strokeWidth="3"
                strokeDasharray={`${overallProgress}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
              {overallProgress}%
            </div>
          </div>
          <div className="ml-6">
            <p className="text-sm text-gray-600">
              You've completed {totalCompleted} of {totalLessons} lessons
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Keep up the good work!
            </p>
          </div>
        </div>
      </div>
      
      {/* Course progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Course Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={courseChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="progress" fill="#4299e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weekly activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={weeklyActivity}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#4299e1"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Individual course progress details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Course Details</h2>
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{course.title}</h3>
                <span className="text-sm font-medium text-blue-500">
                  {course.progress}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{course.completed} of {course.total} lessons completed</span>
                <span>Score: {course.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress; 