import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlusCircle, 
  FiChevronDown, 
  FiBell, 
  FiMail, 
  FiUser, 
  FiCalendar, 
  FiCheck, 
  FiX, 
  FiEdit, 
  FiTrash2, 
  FiAward, 
  FiMessageSquare 
} from 'react-icons/fi';
import axios from 'axios';

// Base URL from .env
const baseUrl = process.env.REACT_APP_API_URL;

const Communications = () => {
  const [activeTab, setActiveTab] = useState('notifications'); // Set default tab to notifications if announcements/messages not available
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Dynamic state variables – no mock data
  // If your backend doesn't provide announcements/messages, these can be empty arrays.
  const [announcements, setAnnouncements] = useState([]);  
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch communications data from the backend
  const fetchCommunicationsData = async () => {
    try {
      setLoading(true);
      // Use admin token for these endpoints.
      const token = localStorage.getItem("accessToken");
      console.log("Admin token:", token);
      if (!token) {
        console.error("No token found. Please log in.");
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // If announcements and messages endpoints return 404, you can skip them:
      let annData = [];
      let msgData = [];
      try {
        const annRes = await axios.get(`${baseUrl}/api/communications/announcements`, config);
        annData = Array.isArray(annRes.data) ? annRes.data : annRes.data.announcements || [];
      } catch (error) {
        console.warn("Announcements endpoint not available, setting empty array.");
      }
      try {
        const msgRes = await axios.get(`${baseUrl}/api/communications/messages`, config);
        msgData = Array.isArray(msgRes.data) ? msgRes.data : msgRes.data.messages || [];
      } catch (error) {
        console.warn("Messages endpoint not available, setting empty array.");
      }
      
      // Fetch notifications
      const notiRes = await axios.get("http://localhost:8000/api/notifications", {
        withCredentials: true,
      },{Headers: {
        Authorization: `Bearer ${token}`,
      }});
      const notiData = Array.isArray(notiRes.data) ? notiRes.data : notiRes.data.notifications || [];

      setAnnouncements(annData);
      setMessages(msgData);
      setNotifications(notiData);
    } catch (error) {
      console.error("Error fetching communications data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunicationsData();
  }, []);

  // Filtering based on search term
  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.message.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMessages = messages.filter(m =>
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for new announcement (unchanged)
  const handleNewAnnouncement = async () => {
    const title = prompt("Enter announcement title:");
    const message = prompt("Enter announcement message:");
    if (!title || !message) return;
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      };
      const payload = { title, message };
      await axios.post(`${baseUrl}/api/communications/announcements/create`, payload, config);
      alert("Announcement created successfully");
      fetchCommunicationsData();
    } catch (error) {
      console.error("Error creating announcement:", error.response?.data || error.message);
      alert("Failed to create announcement");
    }
  };

  // Handler for new notification (unchanged)
  const handleNewNotification = async () => {
    const title = prompt("Enter notification title:");
    const message = prompt("Enter notification message:");
    if (!title || !message) return;
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      };
      const payload = { title, message };
      await axios.post(`${baseUrl}/api/notifications/create`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      });
      alert("Notification created successfully");
      fetchCommunicationsData();
    } catch (error) {
      console.error("Error creating notification:", error.response?.data || error.message);
      alert("Failed to create notification");
    }
  };

  // Notifications actions:
  const handleMarkNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Mark a single notification as read (GET endpoint)
      await axios.get(`${baseUrl}/api/notifications/mark-read/${notificationId}`, config);
      alert("Notification marked as read");
      fetchCommunicationsData();
    } catch (error) {
      console.error("Error marking notification as read:", error.response?.data || error.message);
      alert("Failed to mark notification as read");
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Use POST instead of GET to mark all notifications as read
      await axios.post(`${baseUrl}/api/notifications/mark-all-read`, null, config);
      alert("All notifications marked as read");
      fetchCommunicationsData();
    } catch (error) {
      console.error("Error marking all notifications as read:", error.response?.data || error.message);
      alert("Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${baseUrl}/api/notifications/${notificationId}`, config);
      alert("Notification deleted");
      fetchCommunicationsData();
    } catch (error) {
      console.error("Error deleting notification:", error.response?.data || error.message);
      alert("Failed to delete notification");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading communications...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Communications & Notifications</h1>
        {activeTab === 'announcements' && (
          <button 
            onClick={handleNewAnnouncement}
            className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
          >
            <FiPlusCircle className="mr-2" />
            New Announcement
          </button>
        )}
        {activeTab === 'notifications' && (
          <>
            <button 
              onClick={handleNewNotification}
              className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af] mr-2"
            >
              <FiPlusCircle className="mr-2" />
              New Notification
            </button>
            <button 
              onClick={handleMarkAllNotificationsRead}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Mark All Read
            </button>
          </>
        )}
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-t-xl shadow-sm mb-0">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-4 text-sm font-medium ${activeTab === 'announcements' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiBell className="inline-block mr-2" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-4 text-sm font-medium ${activeTab === 'messages' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiMail className="inline-block mr-2" />
            Messages
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {messages.filter(m => !m.read).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-4 text-sm font-medium ${activeTab === 'notifications' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiBell className="inline-block mr-2" />
            System Notifications
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-white rounded-b-xl shadow-sm p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filter <FiChevronDown className="ml-2" />
            </button>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
              <option>Sort by Date</option>
              <option>Sort by Priority</option>
              <option>Sort by Status</option>
            </select>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} by {announcement.author} • Target: <span className="capitalize">{announcement.audience}</span>
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${announcement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{announcement.message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <FiEdit className="inline-block mr-1" /> Edit
                  </button>
                  <button className="px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50">
                    <FiTrash2 className="inline-block mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {filteredMessages.map(message => (
              <div key={message.id} className={`border ${message.read ? 'border-gray-200' : 'border-[#19a4db] bg-blue-50'} rounded-lg p-4 hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${message.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      <FiUser />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{message.subject}</h3>
                      <p className="text-sm text-gray-500">
                        From: {message.from} ({message.role}) • {new Date(message.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {!message.read && (
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      New
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{message.preview}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1.5 bg-[#19a4db] text-white rounded-lg text-xs font-medium hover:bg-[#1582af]">
                    <FiMessageSquare className="inline-block mr-1" /> Reply
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <FiCheck className="inline-block mr-1" /> Mark as {message.read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • Type: <span className="capitalize">{notification.type}</span>
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${notification.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{notification.message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
                    onClick={() => handleMarkNotificationRead(notification.id)}
                  >
                    <FiCheck className="inline-block mr-1" /> Mark as Read
                  </button>
                  <button 
                    className="px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <FiTrash2 className="inline-block mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Communications;
