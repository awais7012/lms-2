import React from "react";
import { FiBell, FiClock, FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Notifications = () => {
  // Mock notifications data as an array so it can be iterated
  const notifications = [
    {
      id: 1,
      type: "assignment",
      title: "Assignment Due",
      message: "React Components assignment due tomorrow",
      time: "2 hours ago",
      read: false,
      course: "Introduction to React"
    },
    {
      id: 2,
      type: "material",
      title: "New Material Available",
      message: "New lecture notes uploaded for JavaScript course",
      time: "Yesterday",
      read: false,
      course: "Advanced JavaScript"
    },
    {
      id: 3,
      type: "announcement",
      title: "Instructor Announcement",
      message: "No class on Friday due to holiday",
      time: "2 days ago",
      read: true,
      course: "UX/UI Design Fundamentals"
    },
    {
      id: 4,
      type: "grade",
      title: "Assignment Graded",
      message: "Your HTML Basics assignment has been graded",
      time: "3 days ago",
      read: true,
      course: "Web Development Fundamentals"
    },
    {
      id: 5,
      type: "feedback",
      title: "Instructor Feedback",
      message: "You've received feedback on your project submission",
      time: "5 days ago",
      read: true,
      course: "Project Management"
    }
  ];

  // Get the icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "assignment":
        return <FiClock className="h-5 w-5 text-blue-500" />;
      case "material":
        return <FiMail className="h-5 w-5 text-green-500" />;
      case "announcement":
        return <FiBell className="h-5 w-5 text-purple-500" />;
      case "grade":
        return <FiCheckCircle className="h-5 w-5 text-yellow-500" />;
      case "feedback":
        return <FiAlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiBell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        
        <div className="flex items-center space-x-2">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>All Notifications</option>
            <option>Unread</option>
            <option>Assignments</option>
            <option>Announcements</option>
            <option>Grades</option>
          </select>
          
          {unreadCount > 0 && (
            <button className="text-blue-500 hover:text-blue-700 text-sm">
              Mark all as read
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-5 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className={`text-base font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-sm text-gray-500">{notification.time}</span>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {notification.course}
                      </span>
                      
                      {!notification.read && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    {!notification.read && (
                      <button className="text-sm text-blue-500 hover:text-blue-700">
                        Mark as read
                      </button>
                    )}
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <FiBell className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-2 text-sm text-gray-500">
              You're all caught up! Check back later for new notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications; 