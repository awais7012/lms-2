import React, { useState } from "react";
import { FiSave, FiUser, FiMail, FiPhone, FiLock, FiBell, FiGlobe, FiInfo } from "react-icons/fi";

const Settings = () => {
  // Profile state
  const [profile, setProfile] = useState({
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced teacher with 10+ years in Computer Science Education.",
    department: "Computer Science",
    position: "Senior Instructor",
    office: "Room 305, Building B"
  });
  
  // Notification preferences state
  const [notifications, setNotifications] = useState({
    assignmentSubmissions: true,
    studentMessages: true,
    courseAnnouncements: true,
    systemUpdates: false,
    emailDigest: "daily"
  });
  
  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    publicProfile: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacy(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send data to an API
    console.log("Saving settings:", { profile, notifications, privacy });
    // Show success notification
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
        </div>
        
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 -mb-px">
            <button className="py-4 px-1 border-b-2 border-[#19a4db] font-medium text-sm text-[#19a4db]">
              Profile
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Account
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Notifications
            </button>
            <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Privacy
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Profile Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiUser className="mr-2 text-[#19a4db]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={profile.department}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={profile.position}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="office" className="block text-sm font-medium text-gray-700 mb-1">
                  Office Location
                </label>
                <input
                  type="text"
                  id="office"
                  name="office"
                  value={profile.office}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Biography
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Brief description for your profile. This will be displayed publicly.
                </p>
              </div>
            </div>
          </div>
          
          {/* Password */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiLock className="mr-2 text-[#19a4db]" />
              Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div></div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiBell className="mr-2 text-[#19a4db]" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="assignmentSubmissions"
                  name="assignmentSubmissions"
                  type="checkbox"
                  checked={notifications.assignmentSubmissions}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="assignmentSubmissions" className="ml-3 block text-sm font-medium text-gray-700">
                  Assignment submissions
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="studentMessages"
                  name="studentMessages"
                  type="checkbox"
                  checked={notifications.studentMessages}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="studentMessages" className="ml-3 block text-sm font-medium text-gray-700">
                  Student messages
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="courseAnnouncements"
                  name="courseAnnouncements"
                  type="checkbox"
                  checked={notifications.courseAnnouncements}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="courseAnnouncements" className="ml-3 block text-sm font-medium text-gray-700">
                  Course announcements
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="systemUpdates"
                  name="systemUpdates"
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="systemUpdates" className="ml-3 block text-sm font-medium text-gray-700">
                  System updates
                </label>
              </div>
              <div className="pt-2">
                <label htmlFor="emailDigest" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Digest Frequency
                </label>
                <select
                  id="emailDigest"
                  name="emailDigest"
                  value={notifications.emailDigest}
                  onChange={handleNotificationChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#19a4db] focus:border-[#19a4db] sm:text-sm rounded-md"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FiGlobe className="mr-2 text-[#19a4db]" />
              Privacy Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="showEmail"
                  name="showEmail"
                  type="checkbox"
                  checked={privacy.showEmail}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="showEmail" className="ml-3 block text-sm font-medium text-gray-700">
                  Show my email to students
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="showPhone"
                  name="showPhone"
                  type="checkbox"
                  checked={privacy.showPhone}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="showPhone" className="ml-3 block text-sm font-medium text-gray-700">
                  Show my phone number to students
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="publicProfile"
                  name="publicProfile"
                  type="checkbox"
                  checked={privacy.publicProfile}
                  onChange={handlePrivacyChange}
                  className="h-4 w-4 text-[#19a4db] border-gray-300 rounded focus:ring-[#19a4db]"
                />
                <label htmlFor="publicProfile" className="ml-3 block text-sm font-medium text-gray-700">
                  Make my profile visible to all users
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19a4db] mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#19a4db] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#1483b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19a4db] flex items-center"
            >
              <FiSave className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 