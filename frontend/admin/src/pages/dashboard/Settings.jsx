import React, { useState } from 'react';
import { FiSave, FiUser, FiMail, FiPhone, FiLock, FiBell, FiGlobe, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
  // Profile state
  const [profile, setProfile] = useState({
    fullName: 'Admin User',
    email: 'admin@example.com',
    phone: '+91 98765 43210',
    position: 'System Administrator',
    department: 'IT Department',
    bio: 'Experienced administrator with specialization in educational technology systems.'
  });
  
  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'EduLearn Platform',
    maintenanceMode: false,
    defaultLanguage: 'en',
    timeZone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h'
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    browserNotifications: true,
    studentApprovals: true,
    teacherRegistrations: true,
    systemUpdates: true,
    dailySummary: false
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5
  });
  
  // Handler functions
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const handleSystemSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };
  
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePasswordChange = () => {
    alert('Password change functionality will be implemented here');
  };
  
  const handleSaveSettings = (type) => {
    alert(`Save ${type} settings - API implementation required`);
  };
  
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
  
  const handleSaveWithStatus = (type) => {
    // Simulate API call
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
    handleSaveSettings(type);
  };
  
  // Toggle switch styles
  const toggleCheckboxStyle = {
    position: 'absolute',
    right: 0,
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '9999px',
    backgroundColor: 'white',
    border: '4px solid #cbd5e0',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s'
  };
  
  const toggleLabelStyle = {
    display: 'block',
    overflow: 'hidden',
    height: '1.5rem',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>
      
      {/* Save status message */}
      {saveStatus === 'success' && (
        <div className="mb-4 bg-green-50 text-green-800 p-4 rounded-lg flex items-center">
          <FiCheckCircle className="mr-2" />
          Settings have been saved successfully.
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mb-4 bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          There was an error saving your settings. Please try again.
        </div>
      )}
      
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiUser className="mr-2 text-[#19a4db]" />
            Admin Profile
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSaveWithStatus('profile'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={profile.position}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <FiLock className="inline-block mr-2" />
                  Set New Password
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
              >
                <FiSave className="inline-block mr-2" />
                Save Profile
              </button>
            </div>
          </form>
        </div>
        
        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiGlobe className="mr-2 text-[#19a4db]" />
            System Configuration
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSaveWithStatus('system'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={systemSettings.siteName}
                  onChange={handleSystemSettingsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                <select
                  name="defaultLanguage"
                  value={systemSettings.defaultLanguage}
                  onChange={handleSystemSettingsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  name="timeZone"
                  value={systemSettings.timeZone}
                  onChange={handleSystemSettingsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                >
                  <option value="Asia/Kolkata">India (GMT +5:30)</option>
                  <option value="America/New_York">Eastern Time (GMT -5:00)</option>
                  <option value="America/Los_Angeles">Pacific Time (GMT -8:00)</option>
                  <option value="Europe/London">London (GMT +0:00)</option>
                  <option value="Asia/Dubai">Dubai (GMT +4:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select
                  name="dateFormat"
                  value={systemSettings.dateFormat}
                  onChange={handleSystemSettingsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                <select
                  name="timeFormat"
                  value={systemSettings.timeFormat}
                  onChange={handleSystemSettingsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
              <div>
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={systemSettings.maintenanceMode}
                    onChange={handleSystemSettingsChange}
                    className="h-4 w-4 text-[#19a4db] rounded border-gray-300 focus:ring-[#19a4db]"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                    Enable Maintenance Mode
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
              >
                <FiSave className="inline-block mr-2" />
                Save System Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBell className="mr-2 text-[#19a4db]" />
            Notification Preferences
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSaveWithStatus('notifications'); }}>
            <div className="space-y-4 mb-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    id="emailNotifications" 
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.emailNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="emailNotifications" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.emailNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* SMS Notifications */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="smsNotifications" 
                    id="smsNotifications" 
                    checked={notificationSettings.smsNotifications}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.smsNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="smsNotifications" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.smsNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* Browser Notifications */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Browser Notifications</h3>
                  <p className="text-xs text-gray-500">Receive notifications in the browser</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="browserNotifications" 
                    id="browserNotifications" 
                    checked={notificationSettings.browserNotifications}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.browserNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="browserNotifications" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.browserNotifications ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* Student Approval Alerts */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Student Approval Alerts</h3>
                  <p className="text-xs text-gray-500">Alerts when a new student needs approval</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="studentApprovals" 
                    id="studentApprovals" 
                    checked={notificationSettings.studentApprovals}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.studentApprovals ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="studentApprovals" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.studentApprovals ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* Teacher Registration Alerts */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Teacher Registration Alerts</h3>
                  <p className="text-xs text-gray-500">Alerts when a new teacher registers</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="teacherRegistrations" 
                    id="teacherRegistrations" 
                    checked={notificationSettings.teacherRegistrations}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.teacherRegistrations ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="teacherRegistrations" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.teacherRegistrations ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* System Updates */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">System Updates</h3>
                  <p className="text-xs text-gray-500">Get notified about system updates</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="systemUpdates" 
                    id="systemUpdates" 
                    checked={notificationSettings.systemUpdates}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.systemUpdates ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="systemUpdates" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.systemUpdates ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              {/* Daily Summary */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Daily Summary</h3>
                  <p className="text-xs text-gray-500">Receive a daily summary of all activity</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="dailySummary" 
                    id="dailySummary" 
                    checked={notificationSettings.dailySummary}
                    onChange={handleNotificationChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: notificationSettings.dailySummary ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="dailySummary" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: notificationSettings.dailySummary ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
              >
                <FiSave className="inline-block mr-2" />
                Save Notification Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiLock className="mr-2 text-[#19a4db]" />
            Security Settings
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSaveWithStatus('security'); }}>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-500">Require a verification code when logging in</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="twoFactorAuth" 
                    id="twoFactorAuth" 
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecurityChange}
                    style={{
                      ...toggleCheckboxStyle,
                      borderColor: securitySettings.twoFactorAuth ? '#19a4db' : '#cbd5e0'
                    }}
                  />
                  <label 
                    htmlFor="twoFactorAuth" 
                    style={{
                      ...toggleLabelStyle,
                      backgroundColor: securitySettings.twoFactorAuth ? '#19a4db' : '#cbd5e0'
                    }}
                  ></label>
                </div>
              </div>
              
              <div className="py-2 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-800">Password Expiry</h3>
                  <div className="text-sm text-gray-600">{securitySettings.passwordExpiry} days</div>
                </div>
                <p className="text-xs text-gray-500 mb-2">Force password change after specified days</p>
                <input
                  type="range"
                  name="passwordExpiry"
                  min="30"
                  max="180"
                  step="30"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecurityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 days</span>
                  <span>180 days</span>
                </div>
              </div>
              
              <div className="py-2 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-800">Session Timeout</h3>
                  <div className="text-sm text-gray-600">{securitySettings.sessionTimeout} minutes</div>
                </div>
                <p className="text-xs text-gray-500 mb-2">Automatically log out after inactivity</p>
                <input
                  type="range"
                  name="sessionTimeout"
                  min="15"
                  max="120"
                  step="15"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15 min</span>
                  <span>120 min</span>
                </div>
              </div>
              
              <div className="py-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-800">Failed Login Attempts</h3>
                  <div className="text-sm text-gray-600">{securitySettings.loginAttempts}</div>
                </div>
                <p className="text-xs text-gray-500 mb-2">Max attempts before account lockout</p>
                <input
                  type="range"
                  name="loginAttempts"
                  min="3"
                  max="10"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 attempts</span>
                  <span>10 attempts</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
              >
                <FiSave className="inline-block mr-2" />
                Save Security Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 