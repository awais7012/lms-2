import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiDownload, 
  FiAward, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX 
} from 'react-icons/fi';
import axios from 'axios';

// Base URL from .env
const baseUrl = process.env.REACT_APP_API_URL;

const Certifications = () => {
  // 'view' can be "student" (default: get all student certificates) or "course" (filter by course)
  const [activeTab, setActiveTab] = useState('issued');
  const [view, setView] = useState("student");
  const [courseFilter, setCourseFilter] = useState(""); // for filtering course certificates
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch certificates from the backend based on the current view
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        setLoading(false);
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let res;
      if (view === "student") {
        // Fetch certificates for all students
        res = await axios.get(`${baseUrl}/api/certificates/admin`, config);
      } else if (view === "course") {
        // For course view, courseFilter must be provided
        if (!courseFilter) {
          alert("Please enter a course ID to filter certificates.");
          setLoading(false);
          return;
        }
        res = await axios.get(`${baseUrl}/api/certificates/course/${courseFilter}`, config);
      }
      // Assume response is an array or object with certificates array
      const data = Array.isArray(res.data) ? res.data : res.data.certificates || [];
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, courseFilter]);

  // Filter certificates by search term
  const filteredCertificates = certificates.filter(cert => 
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions for actions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewCertificate = async () => {
    // Prompt for the certificate template name
    const templateName = prompt("Enter certificate template name:");
    if (!templateName) return;
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Please log in first.");
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        withCredentials: true, // in case your backend uses cookies
      };
  
      // Build the payload according to your backend requirements.
      // Adjust field names if your backend expects different keys.
      const payload = {
        templateName,
        description: "Default certificate template", // Adjust if needed or prompt the user
        issuer: "EduLearn",                           // Change if needed
        validFrom: new Date().toISOString(),
        validTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      };
  
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/certificates/admin`,
        payload,
        config
      );
      
      alert("Certificate template created successfully.");
      // Refresh the certificate list if needed:
      fetchCertificates(); // Ensure this function is defined to refresh the list.
    } catch (error) {
      console.error("Error creating certificate template:", error.response?.data || error.message);
      alert("Failed to create certificate template.");
    }
  };
  
  
  
  const handleIssueCertificate = async (courseId, studentId) => {
    // Issue certificate functionality.
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(`${baseUrl}/api/certificates/issue/${courseId}/${studentId}`, {}, config);
      alert(`Certificate issued for student ${studentId} in course ${courseId}`);
      fetchCertificates();
    } catch (error) {
      console.error("Error issuing certificate:", error.response?.data || error.message);
      alert("Failed to issue certificate.");
    }
  };

  const handleViewCertificate = (id) => {
    alert(`View certificate ${id}`);
    // Or navigate to a detailed view
  };

  const handleEditCertificate = (id) => {
    alert(`Edit certificate ${id}`);
    // Implement editing functionality
  };

  const handleDeleteCertificate = (id) => {
    alert(`Delete certificate ${id}`);
    // Implement delete functionality
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading certificates...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Certification Management</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Certificates</p>
              <h3 className="text-3xl font-bold text-gray-800">{certificates.length}</h3>
              <p className="text-gray-500 text-xs font-medium mt-2">All-time issued</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiAward className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        {/* <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pending Approval</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'pending').length}
              </h3>
              <p className="text-yellow-500 text-xs font-medium mt-2">Requires review</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiCheck className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Rejected</p>
              <h3 className="text-3xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'rejected').length}
              </h3>
              <p className="text-red-500 text-xs font-medium mt-2">Not approved</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiX className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div> */}
      </div>
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search certificates"
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg flex items-center text-sm hover:bg-gray-50"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={handleNewCertificate}
            className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
          >
            <FiPlus className="inline-block mr-2" />
            New Certificate Template
          </button> */}
          {/* <button
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <FiDownload className="inline-block mr-2" />
            Export
          </button> */}
        </div>
      </div>
      
      {/* Optional: Filters Panel */}
      {filterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {/* You can integrate dynamic filters from your API if needed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <input
                type="text"
                placeholder="Enter course ID"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                <option>All Time</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                <option>All Grades</option>
                <option>A+, A, A-</option>
                <option>B+, B, B-</option>
                <option>C+, C, C-</option>
                <option>D or lower</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 mr-2">
              Reset Filters
            </button>
            <button className="px-3 py-1.5 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]">
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Certificates List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCertificates.map(cert => (
              <tr key={cert.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cert.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                  <div className="text-sm text-gray-500">{cert.studentId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cert.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cert.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                    cert.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                    cert.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cert.grade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    cert.status === 'issued' ? 'bg-green-100 text-green-800' :
                    cert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not issued'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    {/* If certificate status is pending, allow issue, approve, or reject */}
                    {cert.status === 'pending' && (
                      <>
                        <button 
                          className="text-green-600 hover:text-green-800"
                          title="Issue Certificate"
                          onClick={() => handleIssueCertificate(cert.courseId, cert.studentId)}
                        >
                          <FiCheck />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          title="Reject"
                          onClick={() => alert(`Reject certificate ${cert.id}`)}
                        >
                          <FiX />
                        </button>
                      </>
                    )}
                    {/* For issued certificates, allow viewing */}
                    {cert.status === 'issued' && (
                      <button 
                        onClick={() => handleViewCertificate(cert.id)}
                        className="text-[#19a4db] hover:text-[#1582af]"
                      >
                        <FiEye />
                      </button>
                    )}
                    <button 
                      onClick={() => handleEditCertificate(cert.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteCertificate(cert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <div className="text-center py-12">
          <FiAward className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No certificates match your current filters.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchTerm('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#19a4db] hover:bg-[#1582af]"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
