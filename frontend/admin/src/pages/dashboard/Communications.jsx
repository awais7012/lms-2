import React, { useState } from 'react';
import { FiSearch, FiSend, FiBell, FiMail, FiMessageSquare, FiFilter, FiChevronDown, FiUser, FiUsers, FiCalendar, FiPlusCircle, FiCheck, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';

const Communications = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  
  // Mock data for announcements
  const announcements = [
    {
      id: 'ANN-001',
      title: 'Platform Maintenance Notice',
      message: 'The platform will be undergoing scheduled maintenance on June 15th from 2 AM to 4 AM. Please plan accordingly.',
      date: '2023-06-10',
      status: 'active',
      audience: 'all',
      author: 'System Admin'
    },
    {
      id: 'ANN-002',
      title: 'New Course Registrations Open',
      message: 'New courses for the summer semester are now open for registration. Early bird discounts available until June 20th.',
      date: '2023-06-08',
      status: 'active',
      audience: 'students',
      author: 'Academic Office'
    },
    {
      id: 'ANN-003',
      title: 'Teacher Training Workshop',
      message: 'All teachers are invited to attend a training workshop on advanced teaching methodologies on June 18th.',
      date: '2023-06-05',
      status: 'active',
      audience: 'teachers',
      author: 'Faculty Development'
    },
    {
      id: 'ANN-004',
      title: 'End of Semester Feedback',
      message: 'Please complete the end of semester feedback forms to help us improve our courses and teaching methods.',
      date: '2023-05-30',
      status: 'expired',
      audience: 'students',
      author: 'Quality Assurance'
    }
  ];
  
  // Mock data for messages
  const messages = [
    {
      id: 'MSG-001',
      from: 'Rahul Kumar',
      role: 'student',
      subject: 'Question about React assignment',
      preview: 'I have a question regarding the React component assignment...',
      date: '2023-06-11',
      read: false
    },
    {
      id: 'MSG-002',
      from: 'Dr. Sanjay Mehta',
      role: 'teacher',
      subject: 'Updated course materials',
      preview: 'I have uploaded the updated course materials for Python class...',
      date: '2023-06-10',
      read: true
    },
    {
      id: 'MSG-003',
      from: 'Priya Sharma',
      role: 'student',
      subject: 'Request for extension',
      preview: 'Due to medical reasons, I would like to request an extension...',
      date: '2023-06-09',
      read: true
    },
    {
      id: 'MSG-004',
      from: 'Prof. Meera Kapoor',
      role: 'teacher',
      subject: 'Workshop postponed',
      preview: 'The Flutter development workshop scheduled for tomorrow...',
      date: '2023-06-08',
      read: true
    }
  ];
  
  // Mock data for notifications
  const notifications = [
    {
      id: 'NOT-001',
      title: 'System Update Complete',
      message: 'The system update has been completed successfully.',
      date: '2023-06-12',
      type: 'system',
      priority: 'normal'
    },
    {
      id: 'NOT-002',
      title: 'New Student Registrations',
      message: '15 new students have registered in the last 24 hours.',
      date: '2023-06-11',
      type: 'student',
      priority: 'high'
    },
    {
      id: 'NOT-003',
      title: 'Course Materials Updated',
      message: 'Dr. Sanjay Mehta has updated Python course materials.',
      date: '2023-06-10',
      type: 'course',
      priority: 'normal'
    },
    {
      id: 'NOT-004',
      title: 'Payment System Alert',
      message: 'The payment gateway is experiencing some delays.',
      date: '2023-06-10',
      type: 'system',
      priority: 'high'
    }
  ];
  
  // Handler functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleNewAnnouncement = () => {
    alert('Create new announcement functionality will be implemented here');
  };
  
  const handleNewNotification = () => {
    alert('Create new notification functionality will be implemented here');
  };
  
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
          <button 
            onClick={handleNewNotification}
            className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
          >
            <FiPlusCircle className="mr-2" />
            New Notification
          </button>
        )}
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-t-xl shadow-sm mb-0">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'announcements' 
                ? 'text-[#19a4db] border-b-2 border-[#19a4db]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiBell className="inline-block mr-2" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'messages' 
                ? 'text-[#19a4db] border-b-2 border-[#19a4db]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiMail className="inline-block mr-2" />
            Messages
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {messages.filter(m => !m.read).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === 'notifications' 
                ? 'text-[#19a4db] border-b-2 border-[#19a4db]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiBell className="inline-block mr-2" />
            System Notifications
          </button>
        </div>
      </div>
      
      {/* Content area */}
      <div className="bg-white rounded-b-xl shadow-sm p-6">
        {/* Search and filters */}
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
              Filter
              <FiChevronDown className="ml-2" />
            </button>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
              <option>Sort by Date</option>
              <option>Sort by Priority</option>
              <option>Sort by Status</option>
            </select>
          </div>
        </div>
        
        {/* Announcements tab content */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {announcements.filter(a => 
              a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.message.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(announcement => (
              <div key={announcement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' '}by {announcement.author} 
                      {' '}• Target: <span className="capitalize">{announcement.audience}</span>
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    announcement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{announcement.message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <FiEdit className="inline-block mr-1" />
                    Edit
                  </button>
                  <button className="px-3 py-1.5 border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50">
                    <FiTrash2 className="inline-block mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Messages tab content */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.filter(m => 
              m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
              m.preview.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(message => (
              <div key={message.id} className={`border ${message.read ? 'border-gray-200' : 'border-[#19a4db] bg-blue-50'} rounded-lg p-4 hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      message.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FiUser />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{message.subject}</h3>
                      <p className="text-sm text-gray-500">
                        From: {message.from} ({message.role})
                        {' '}• {new Date(message.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                    <FiMessageSquare className="inline-block mr-1" />
                    Reply
                  </button>
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <FiCheck className="inline-block mr-1" />
                    Mark as {message.read ? 'Unread' : 'Read'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Notifications tab content */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.filter(n => 
              n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              n.message.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(notification => (
              <div key={notification.id} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                notification.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{notification.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' '}• Type: <span className="capitalize">{notification.type}</span>
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    notification.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{notification.message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <FiCheck className="inline-block mr-1" />
                    Mark as Resolved
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