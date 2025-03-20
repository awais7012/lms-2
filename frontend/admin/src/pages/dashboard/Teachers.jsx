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
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/adminRoutes/teachers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setTeachers(response.data.teachers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Filter teachers based on approval status
  const getPendingTeachers = () => {
    return teachers.filter(
      (teacher) => !teacher.isApproved && !teacher.isRejected
    );
  };

  const getApprovedTeachers = () => {
    return teachers.filter((teacher) => teacher.isApproved);
  };

  const getRejectedTeachers = () => {
    return teachers.filter((teacher) => teacher.isRejected);
  };

  // Get teachers based on active tab
  const getFilteredTeachers = () => {
    let filteredTeachers = [];
    switch (activeTab) {
      case "pending":
        filteredTeachers = getPendingTeachers();
        break;
      case "approved":
        filteredTeachers = getApprovedTeachers();
        break;
      case "rejected":
        filteredTeachers = getRejectedTeachers();
        break;
      case "all":
        filteredTeachers = teachers;
        break;
      default:
        filteredTeachers = getPendingTeachers();
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      return filteredTeachers.filter(
        (teacher) =>
          teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredTeachers;
  };

  // Action handlers
  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/adminRoutes/teachers/${id}/status`,
        { action: "approve" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update the local state
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === id
            ? { ...teacher, isApproved: true, isRejected: false }
            : teacher
        )
      );

      console.log(`Approved teacher with ID: ${id}`);
      alert("Teacher approved successfully");
    } catch (error) {
      console.error("Error approving teacher:", error);
      alert("Failed to approve teacher");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/adminRoutes/teachers/${id}/status`,
        { action: "reject" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update the local state
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === id
            ? { ...teacher, isApproved: false, isRejected: true }
            : teacher
        )
      );

      console.log(`Rejected teacher with ID: ${id}`);
      alert("Teacher rejected successfully");
    } catch (error) {
      console.error("Error rejecting teacher:", error);
      alert("Failed to reject teacher");
    }
  };

  const handleView = (id) => {
    console.log(`Viewing teacher with ID: ${id}`);
    // Here you would navigate to teacher detail page
  };

  const handleContact = (email) => {
    console.log(`Contacting teacher with email: ${email}`);
    // Here you would open email client or message interface
  };

  const handleExport = () => {
    console.log("Exporting teacher data");
    // Here you would generate and download CSV/Excel file
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Teacher Management
      </h1>

      {/* Action bar with tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-4">
          <div className="flex space-x-4 mb-4 sm:mb-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All Teachers
            </button>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 ${
                filterOpen ? "bg-gray-50" : ""
              }`}
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
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                  <option value="">All Specializations</option>
                  <option value="web">Web Development</option>
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="fullstack">Full Stack Development</option>
                  <option value="ui">UX/UI Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                  <option value="">Any Experience</option>
                  <option value="0-3">0-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Date
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                  <option value="">Any Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm mr-2 hover:bg-gray-200">
                Reset
              </button>
              <button className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm hover:bg-[#1483b0]">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Teacher cards */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {activeTab === "pending" && "Teachers Awaiting Approval"}
          {activeTab === "approved" && "Approved Teachers"}
          {activeTab === "rejected" && "Rejected Teachers"}
          {activeTab === "all" && "All Teachers"}
          <span className="text-gray-500 text-sm font-normal ml-2">
            ({getFilteredTeachers().length})
          </span>
        </h2>

        {getFilteredTeachers().length === 0 ? (
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
          <div className="space-y-4">
            {getFilteredTeachers().map((teacher) => (
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
                          <span className="font-medium">
                            Reason for rejection:
                          </span>{" "}
                          {teacher.reason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:ml-auto">
                    <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                      {!teacher.isApproved && !teacher.isRejected && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Pending Approval
                        </span>
                      )}
                      {teacher.isApproved && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Approved
                        </span>
                      )}
                      {teacher.isRejected && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(teacher._id)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <FiEye className="inline-block mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleContact(teacher.email)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <FiMail className="inline-block mr-1" />
                        Contact
                      </button>
                      {!teacher.isApproved && (
                        <button
                          onClick={() => handleApprove(teacher._id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          <FiUserCheck className="inline-block mr-1" />
                          Approve
                        </button>
                      )}
                      {!teacher.isRejected && (
                        <button
                          onClick={() => handleReject(teacher._id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                        >
                          <FiUserX className="inline-block mr-1" />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Pending Approvals
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {getPendingTeachers().length}
              </h3>
              <p className="text-yellow-500 text-xs font-medium mt-2">
                Requires attention
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiUserPlus className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Approved Teachers
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {getApprovedTeachers().length}
              </h3>
              <p className="text-green-500 text-xs font-medium mt-2">
                Active faculty
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiUserCheck className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                Avg. Experience
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {getApprovedTeachers().length > 0
                  ? Math.round(
                      getApprovedTeachers().reduce((sum, teacher) => {
                        const exp = teacher.experience
                          ? parseInt(teacher.experience)
                          : 0;
                        return sum + exp;
                      }, 0) / getApprovedTeachers().length
                    )
                  : 0}
                y
              </h3>
              <p className="text-blue-500 text-xs font-medium mt-2">
                Years of teaching
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiBriefcase className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
