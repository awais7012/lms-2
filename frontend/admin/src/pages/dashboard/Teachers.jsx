import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiDownload,
  FiEye,
  FiCalendar,
  FiBook,
  FiBriefcase,
} from "react-icons/fi";

const Teachers = () => {
  // We'll remove the filtering by status and always show "all" teachers
  // const [activeTab, setActiveTab] = useState("pending");
  const baseUrl = process.env.REACT_APP_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers data using the dynamic base URL and admin token
  useEffect(() => {
    const fetchTeachers = async () => {
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
          params: { role: "teacher" },
        });
    
        console.log("API Response:", response.data); // Debugging: check the data structure
    
        // Extract students list from `users` array
        const data = response.data.users || [];
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers :", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Instead of filtering by pending/approved/rejected,
  // we just filter by the search term on all teachers.
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Action handlers remain the same
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/adminRoutes/teachers/${id}/status`,
        { action: "approve" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Teacher approved successfully");
      // Optionally, you might want to refresh teacher data here.
    } catch (error) {
      console.error("Error approving teacher:", error.response?.data || error.message);
      alert("Failed to approve teacher");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/adminRoutes/teachers/${id}/status`,
        { action: "reject" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Teacher rejected successfully");
      // Optionally refresh teacher data
    } catch (error) {
      console.error("Error rejecting teacher:", error.response?.data || error.message);
      alert("Failed to reject teacher");
    }
  };

  const handleView = (id) => {
    alert(`Viewing teacher with ID: ${id}`);
    // Navigate to teacher detail page if needed
  };

  const handleContact = (email) => {
    alert(`Contact teacher at: ${email}`);
    // Open email client or messaging interface
  };

  const handleExport = () => {
    alert("Exporting teacher data...");
    // Implement export functionality as needed
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading teachers...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Teacher Management</h1>

      {/* Action bar with search and controls */}
      <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {/* Filter and Export Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${filterOpen ? "bg-gray-50" : ""}`}
            >
              <FiFilter />
            </button>
            <button
              onClick={handleExport}
              className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FiDownload />
            </button>
          </div>
        </div>
        {filterOpen && (
          <div className="mt-4 px-6 py-4 border-t border-gray-100">
            {/* Optionally add filter options here */}
            <div className="text-sm text-gray-600">Filter options can go here</div>
          </div>
        )}
      </div>

      {/* Teacher List */}
      <div className="space-y-4">
        {filteredTeachers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
              <FiUserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No Teachers Found
            </h3>
            <p className="text-gray-500">Try changing your search criteria.</p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => (
            <div
              key={teacher._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col md:flex-row items-start mb-4 md:mb-0 md:mr-6">
                  <img
                    src={teacher.photo || "https://via.placeholder.com/150"}
                    alt={teacher.username || "Teacher"}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mr-4 mb-4 md:mb-0"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {teacher.username || "Unknown Teacher"}
                    </h3>
                    <p className="text-gray-600">{teacher.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {teacher.phone || "No phone number"}
                    </p>

                    <div className="flex flex-wrap mt-2 gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiBook className="mr-1" size={12} />
                        {teacher.specialization || "Teaching"}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiBriefcase className="mr-1" size={12} />
                        {teacher.experience || "Experience not specified"}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <FiCalendar className="mr-1" size={12} />
                        {teacher.createdAt
                          ? new Date(teacher.createdAt).toLocaleDateString()
                          : "Date not available"}
                      </span>
                    </div>

                    {teacher.reason && (
                      <div className="mt-2 text-sm text-red-600">
                        <span className="font-medium">Reason for rejection:</span>{" "}
                        {teacher.reason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:ml-auto">
                  {/* Removed pending/approved filtering actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(teacher._id)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <FiEye className="inline-block mr-1" /> View
                    </button>
                    <button
                      onClick={() => handleContact(teacher.email)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <FiMail className="inline-block mr-1" /> Contact
                    </button>
                    {/* Optional: You can still show Approve/Reject if needed */}
                    {/* <button
                      onClick={() => handleApprove(teacher._id)}
                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                    >
                      <FiUserCheck className="inline-block mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(teacher._id)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                    >
                      <FiUserX className="inline-block mr-1" /> Reject
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teachers;
