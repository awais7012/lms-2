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
  FiAlertCircle,
} from "react-icons/fi";

const Students = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/adminRoutes/students",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setStudents(response.data.students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on approval status
  const getPendingStudents = () => {
    return students.filter(
      (student) => !student.isApproved && !student.isRejected
    );
  };

  const getApprovedStudents = () => {
    return students.filter((student) => student.isApproved);
  };

  const getRejectedStudents = () => {
    return students.filter((student) => student.isRejected);
  };

  const getFilteredStudents = () => {
    let filteredStudents = [];

    if (activeTab === "pending") {
      filteredStudents = getPendingStudents();
    } else if (activeTab === "approved") {
      filteredStudents = getApprovedStudents();
    } else if (activeTab === "rejected") {
      filteredStudents = getRejectedStudents();
    } else {
      filteredStudents = students;
    }

    if (searchTerm) {
      return filteredStudents.filter(
        (student) =>
          student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredStudents;
  };

  const handleApprove = async (studentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/adminRoutes/students/${studentId}/status`,
        { action: "approve" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update the local state
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, isApproved: true, isRejected: false }
            : student
        )
      );

      alert(`Student ${studentId} approved successfully`);
    } catch (error) {
      console.error("Error approving student:", error);
      alert("Failed to approve student");
    }
  };

  const handleReject = async (studentId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/adminRoutes/students/${studentId}/status`,
        { action: "reject" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      // Update the local state
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, isApproved: false, isRejected: true }
            : student
        )
      );

      alert(`Student ${studentId} rejected`);
    } catch (error) {
      console.error("Error rejecting student:", error);
      alert("Failed to reject student");
    }
  };

  const handleView = (studentId) => {
    // In a real app, you would navigate to the student details page
    console.log(`Viewing student ${studentId}`);
  };

  const handleContact = (studentEmail) => {
    // In a real app, you would open a contact form or mail client
    console.log(`Contacting student at ${studentEmail}`);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1582af] transition-colors text-sm font-medium flex items-center">
            <FiUserPlus className="mr-2" />
            Add Student
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="font-semibold text-lg text-gray-800 flex items-center">
                <FiUserPlus className="mr-2 text-[#19a4db]" />
                Student Registrations
              </h2>
              <p className="text-gray-500 text-sm">
                {activeTab === "pending"
                  ? `${getPendingStudents().length} pending approvals`
                  : activeTab === "approved"
                  ? `${getApprovedStudents().length} approved students`
                  : activeTab === "rejected"
                  ? `${getRejectedStudents().length} rejected applications`
                  : "All student registrations"}
              </p>
            </div>

            <div className="flex flex-wrap items-center space-x-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                />
              </div>

              <button
                onClick={handleFilterToggle}
                className={`p-2 border ${
                  filterOpen
                    ? "border-[#19a4db] text-[#19a4db] bg-blue-50"
                    : "border-gray-200 text-gray-600"
                } rounded-lg hover:bg-gray-50`}
              >
                <FiFilter />
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                    <option value="">All Courses</option>
                    <option>Introduction to React</option>
                    <option>Advanced JavaScript</option>
                    <option>UX/UI Design Fundamentals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                    <option value="">All Time</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-b-2 border-[#19a4db] text-[#19a4db] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Approvals
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "approved"
                  ? "border-b-2 border-[#19a4db] text-[#19a4db] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "rejected"
                  ? "border-b-2 border-[#19a4db] text-[#19a4db] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "all"
                  ? "border-b-2 border-[#19a4db] text-[#19a4db] bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Students
            </button>
          </nav>
        </div>

        {activeTab === "pending" && (
          <div className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={student.photo}
                        alt={student.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">
                          {student.username}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">{student.email}</span>
                          <span className="mr-3">{student.phone}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {student.course}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                      <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                        <FiCalendar className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          Applied: {student.appliedDate}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(student._id)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiEye className="inline-block mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleContact(student.email)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiMail className="inline-block mr-1" />
                          Contact
                        </button>
                        <button
                          onClick={() => handleApprove(student._id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          <FiUserCheck className="inline-block mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(student._id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                        >
                          <FiUserX className="inline-block mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
                  <FiUserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Pending Approvals
                </h3>
                <p className="text-gray-500">
                  All student registrations have been processed.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={student.photo}
                        alt={student.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">
                          {student.username}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">{student.email}</span>
                          <span className="mr-3">{student.phone}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {student.course}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                      <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <FiUserCheck className="mr-1" />
                          Approved: {student.approvedDate}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(student._id)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiEye className="inline-block mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleContact(student.email)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiMail className="inline-block mr-1" />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <FiUserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Approved Students
                </h3>
                <p className="text-gray-500">
                  No student applications have been approved yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "rejected" && (
          <div className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={student.photo}
                        alt={student.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">
                          {student.username}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">{student.email}</span>
                          <span className="mr-3">{student.phone}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {student.course}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                      <div className="flex flex-col mb-4 md:mb-0 md:mr-6">
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <FiUserX className="mr-1" />
                          Rejected: {student.rejectedDate}
                        </span>
                        <span className="text-sm text-gray-600 mt-1 flex items-center">
                          <FiAlertCircle className="text-red-500 mr-1" />
                          Reason: {student.reason}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(student._id)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiEye className="inline-block mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleContact(student.email)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiMail className="inline-block mr-1" />
                          Contact
                        </button>
                        <button
                          onClick={() => handleApprove(student._id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          <FiUserCheck className="inline-block mr-1" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <FiUserX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Rejected Applications
                </h3>
                <p className="text-gray-500">
                  No student applications have been rejected.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "all" && (
          <div className="divide-y divide-gray-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <img
                        src={student.photo}
                        alt={student.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">
                          {student.username}
                        </h3>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">{student.email}</span>
                          <span className="mr-3">{student.phone}</span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {student.course}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                      <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                        {student.isApproved && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Approved
                          </span>
                        )}
                        {student.isRejected && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(student._id)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiEye className="inline-block mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleContact(student.email)}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <FiMail className="inline-block mr-1" />
                          Contact
                        </button>
                        {student.isApproved === false && (
                          <button
                            onClick={() => handleApprove(student._id)}
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                          >
                            <FiUserCheck className="inline-block mr-1" />
                            Approve
                          </button>
                        )}
                        {student.isRejected === true && (
                          <button
                            onClick={() => handleReject(student._id)}
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
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <FiUserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  No Students Found
                </h3>
                <p className="text-gray-500">
                  Try changing your search criteria.
                </p>
              </div>
            )}
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
                {getPendingStudents().length}
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
                Approved Students
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {getApprovedStudents().length}
              </h3>
              <p className="text-green-500 text-xs font-medium mt-2">
                Active enrollments
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
                Rejection Rate
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                {Math.round(
                  (getRejectedStudents().length /
                    (getRejectedStudents().length +
                      getApprovedStudents().length)) *
                    100
                )}
                %
              </h3>
              <p className="text-blue-500 text-xs font-medium mt-2">
                Based on processed applications
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUserX className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
