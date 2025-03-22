import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiPlusCircle,
  FiUserPlus,
  FiEye,
  FiMail,
  FiDownload,
  FiCalendar,
  FiAlertCircle,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";

// Use the base URL from your .env file
const baseUrl = process.env.REACT_APP_API_URL;

const Students = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        setLoading(false);
        return;
      }
  
      const response = await axios.get(`${baseUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { role: "student" },
      });
  
      console.log("API Response:", response.data); // Debugging: check the data structure
  
      // Extract students list from `users` array
      const data = response.data.users || [];
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  useEffect(() => {
    console.log("Students List Updated:", students);
  }, [students]);
  
  
  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Log updates to students list
  useEffect(() => {
    console.log("Students List Updated:", students);
  }, [students]);
  
  useEffect(() => {
    fetchStudents();
  }, []);
  
  useEffect(() => {
    console.log("Students List Updated:", students);
  }, [students]);
    

  // Define handleSearch here so it's available in the component's scope.
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle the "Add Student" form
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  // Handle input changes for the add student form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for adding a student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        username: formData.username,
        role: "student",
        is_active: true,
        password: formData.password
      };
      await axios.post(`${baseUrl}/api/auth/signup`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Student added successfully");
      setFormData({ email: "", username: "", password: "" });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error.response?.data || error.message);
      alert("Failed to add student");
    }
  };

  // Dummy handlers for Approve, Reject, View, Contact
  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/students/${studentId}/status`,
        { action: "approve" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId ? { ...student, isApproved: true } : student
        )
      );
    } catch (error) {
      console.error("Error approving student:", error.response?.data || error.message);
    }
  };

  const handleReject = async (studentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/students/${studentId}/status`,
        { action: "reject" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((prev) =>
        prev.map((student) =>
          student._id === studentId ? { ...student, isRejected: true } : student
        )
      );
    } catch (error) {
      console.error("Error rejecting student:", error.response?.data || error.message);
    }
  };

  const handleView = (studentId) => {
    console.log(`Viewing student ${studentId}`);
  };

  const handleContact = (studentEmail) => {
    console.log(`Contacting student at ${studentEmail}`);
  };

  const filteredStudents = students.filter((s) =>
    s.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper functions for statistics
  const getPendingStudents = () => {
    return students.filter((s) => !s.isApproved && !s.isRejected);
  };

  const getApprovedStudents = () => {
    return students.filter((s) => !s.isApproved);
  };

  const getRejectedStudents = () => {
    return students.filter((s) => s.isRejected);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={toggleAddForm}
            className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1582af] transition-colors text-sm font-medium"
          >
            <FiPlusCircle className="mr-2" />
            Add Student
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddStudent} className="mb-6 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={toggleAddForm}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="flex">
          <div className="bg-white rounded-xl shadow-sm p-6 [width:100%]">
          <div className="flex justify-between items-start">
          <div className="p-3 rounded-lg">
              <p className="text-gray-500 text-sm font-medium mt-2">
                Number of Students
              </p>
            </div>
            <div className="p-3 rounded-lg">
            <p className="text-gray-500 text-sm font-medium mt-2">
                {getApprovedStudents().length}
              </p>
            </div>
            <div className="p-3 rounded-lg">
            <p className="text-green-500 text-xs font-medium mt-2">
                Active enrollments
              </p>
            </div>
            <div className="p-3 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
            />
          </div>
        </div>
        {loading ? (
          <div>Loading students...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <div key={student._id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={student.photo || "https://via.placeholder.com/150"}
                    alt={student.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{student.username}</p>
                    <p className="text-gray-600 text-sm">{student.email}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleView(student._id)}
                    className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <FiEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleContact(student.email)}
                    className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 ml-2"
                  >
                    <FiMail className="inline mr-1" /> Contact
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

export default Students;
