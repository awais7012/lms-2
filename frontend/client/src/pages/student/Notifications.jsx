import React, { useState, useEffect } from "react";
import { FiBell, FiClock, FiMail, FiCheckCircle, FiAlertCircle, FiTrash } from "react-icons/fi";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${BASE_URL}/api/notifications/mark-read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${BASE_URL}/api/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

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
            <button onClick={markAllAsRead} className="text-blue-500 hover:text-blue-700 text-sm">
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
                key={notification._id} 
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
                      <button onClick={() => markAsRead(notification._id)} className="text-sm text-blue-500 hover:text-blue-700">
                        Mark as read
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification._id)} className="text-sm text-gray-500 hover:text-gray-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6">No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
