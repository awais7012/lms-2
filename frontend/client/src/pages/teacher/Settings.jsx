import { useState, useEffect } from "react"
import { FiSave, FiUser, FiLock, FiBell, FiGlobe, FiInfo, FiLoader, FiAlertCircle } from "react-icons/fi"
import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Create axios instance with auth header
const api = axios.create({
  baseURL: BASE_URL,
})

// Add request interceptor to include token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const Settings = () => {
  // Active tab state
  const [activeTab, setActiveTab] = useState("profile")

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // User state
  const [user, setUser] = useState({
    id: "",
    email: "",
    username: "",
    role: "",
  })

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    bio: "",
    department: "",
    position: "",
    office: "",
    address: "",
  })

  // Password state
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification preferences state (mock data since API doesn't provide this)
  const [notifications, setNotifications] = useState({
    assignmentSubmissions: true,
    studentMessages: true,
    courseAnnouncements: true,
    systemUpdates: false,
    emailDigest: "daily",
  })

  // Privacy settings state (mock data since API doesn't provide this)
  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    publicProfile: true,
  })

  // Fetch user settings on component mount
  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch basic user data
      const userResponse = await api.get("/api/users/me")
      setUser(userResponse.data)

      // Fetch teacher profile data
      const profileResponse = await api.get("/api/teachers/profile")
      const profileData = profileResponse.data

      // Update profile state with fetched data
      setProfile({
        fullName: profileData.profile.full_name || "",
        phone: profileData.profile.phone || "",
        bio: profileData.profile.bio || "",
        department: profileData.profile.department || "",
        position: profileData.profile.position || "",
        office: profileData.profile.office || "",
        address: profileData.profile.address || "",
      })

      // In a real app, you would fetch notification and privacy settings here
      // For now, we'll use the mock data initialized above
    } catch (err) {
      console.error("Error fetching user settings:", err)
      setError("Failed to load user settings. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword((prevPassword) => ({
      ...prevPassword,
      [name]: value,
    }))
  }

  const handleNotificationChange = (e) => {
    const { name, type, checked, value } = e.target
    setNotifications((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target
    setPrivacy((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setSaveSuccess(false)
      setError(null)

      // Save profile data
      if (activeTab === "profile") {
        // Create FormData for teacher profile update
        const formData = new FormData()
        formData.append("full_name", profile.fullName)
        formData.append("bio", profile.bio)
        formData.append("phone", profile.phone)
        formData.append("address", profile.address)
        formData.append("department", profile.department)
        formData.append("position", profile.position)
        formData.append("office", profile.office)

        await api.put("/api/teachers/profile", formData)

        // Update username if it changed
        if (profile.fullName !== user.username) {
          await api.put("/api/users/me", {
            username: profile.fullName,
          })
        }
      }

      // Change password
      if (activeTab === "account" && password.newPassword) {
        if (password.newPassword !== password.confirmPassword) {
          throw new Error("New passwords do not match")
        }

        // Use the users/me endpoint to update password
        await api.put("/api/users/me", {
          password: password.newPassword,
        })

        // Clear password fields after successful change
        setPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }

      // Save notification preferences
      if (activeTab === "notifications") {
        // Note: API endpoint for notification preferences is not provided
        // This is a placeholder for the actual API call
        await api.put("/api/users/notifications", { preferences: notifications })
      }

      // Save privacy settings
      if (activeTab === "privacy") {
        // Note: API endpoint for privacy settings is not provided
        // This is a placeholder for the actual API call
        await api.put("/api/users/privacy", { settings: privacy })
      }

      // Show success message
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)

      // Refresh user data if needed
      if (activeTab === "profile" || activeTab === "account") {
        fetchUserSettings()
      }
    } catch (err) {
      console.error("Error saving settings:", err)
      setError(err.response?.data?.message || err.message || "Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-[#19a4db] mb-4" />
        <p className="text-gray-600">Loading your settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 -mb-px">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-[#19a4db] text-[#19a4db]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "account"
                  ? "border-[#19a4db] text-[#19a4db]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-[#19a4db] text-[#19a4db]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "privacy"
                  ? "border-[#19a4db] text-[#19a4db]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy
            </button>
          </nav>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiInfo className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-green-700">Settings saved successfully!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Information */}
          {activeTab === "profile" && (
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
                    value={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent bg-gray-50"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
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
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
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
          )}

          {/* Password */}
          {activeTab === "account" && (
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
                    value={password.currentPassword}
                    onChange={handlePasswordChange}
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
                    value={password.newPassword}
                    onChange={handlePasswordChange}
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
                    value={password.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
                  />
                  {password.newPassword &&
                    password.confirmPassword &&
                    password.newPassword !== password.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                    )}
                </div>
                <div className="md:col-span-2">
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-yellow-800 mb-1">Account Information</h4>
                    <p className="text-sm text-yellow-700">
                      <strong>Username:</strong> {user.username}
                      <br />
                      <strong>Email:</strong> {user.email}
                      <br />
                      <strong>Role:</strong> {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Preferences */}
          {activeTab === "notifications" && (
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
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
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
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19a4db] mr-3"
              onClick={fetchUserSettings}
              disabled={saving}
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-[#19a4db] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-[#1483b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19a4db] flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings

