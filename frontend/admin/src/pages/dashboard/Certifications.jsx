import React, { useState } from 'react';
import { FiSearch, FiFilter, FiPlus, FiDownload, FiAward, FiUser, FiCalendar, FiFile, FiEye, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const Certifications = () => {
  const [activeTab, setActiveTab] = useState('issued');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Mock data for certificates
  const certificates = [
    {
      id: 'CERT-001',
      studentName: 'Rahul Kumar',
      studentId: 'STU-1001',
      courseName: 'Introduction to React',
      courseId: 'CRS-001',
      issueDate: '2023-05-15',
      expiryDate: '2025-05-15',
      status: 'issued',
      grade: 'A'
    },
    {
      id: 'CERT-002',
      studentName: 'Priya Sharma',
      studentId: 'STU-1002',
      courseName: 'Advanced JavaScript',
      courseId: 'CRS-002',
      issueDate: '2023-05-10',
      expiryDate: '2025-05-10',
      status: 'issued',
      grade: 'A+'
    },
    {
      id: 'CERT-003',
      studentName: 'Vikram Singh',
      studentId: 'STU-1003',
      courseName: 'UX/UI Design Fundamentals',
      courseId: 'CRS-003',
      issueDate: null,
      expiryDate: null,
      status: 'pending',
      grade: 'B+'
    },
    {
      id: 'CERT-004',
      studentName: 'Ananya Patel',
      studentId: 'STU-1004',
      courseName: 'Python for Data Science',
      courseId: 'CRS-004',
      issueDate: '2023-04-20',
      expiryDate: '2025-04-20',
      status: 'issued',
      grade: 'A'
    },
    {
      id: 'CERT-005',
      studentName: 'Raj Malhotra',
      studentId: 'STU-1005',
      courseName: 'Mobile App Development',
      courseId: 'CRS-005',
      issueDate: null,
      expiryDate: null,
      status: 'pending',
      grade: 'B'
    },
    {
      id: 'CERT-006',
      studentName: 'Neha Gupta',
      studentId: 'STU-1006',
      courseName: 'Responsive Web Design',
      courseId: 'CRS-006',
      issueDate: '2023-03-15',
      expiryDate: '2025-03-15',
      status: 'issued',
      grade: 'A-'
    },
    {
      id: 'CERT-007',
      studentName: 'Aditya Kumar',
      studentId: 'STU-1007',
      courseName: 'Introduction to React',
      courseId: 'CRS-001',
      issueDate: null,
      expiryDate: null,
      status: 'rejected',
      grade: 'C'
    }
  ];
  
  // Filter certificates based on active tab and search term
  const filteredCertificates = certificates
    .filter(cert => {
      if (activeTab === 'all') return true;
      return cert.status === activeTab;
    })
    .filter(cert => 
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Handler functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleNewCertificate = () => {
    alert('Create new certificate functionality will be implemented here');
  };
  
  const handleViewCertificate = (id) => {
    alert(`View certificate ${id}`);
  };
  
  const handleEditCertificate = (id) => {
    alert(`Edit certificate ${id}`);
  };
  
  const handleDeleteCertificate = (id) => {
    alert(`Delete certificate ${id}`);
  };
  
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
        
        <div className="bg-white rounded-xl shadow-sm p-6">
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
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'all' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Certificates
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'issued' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('issued')}
          >
            Issued
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'pending' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'rejected' ? 'text-[#19a4db] border-b-2 border-[#19a4db]' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>
        
        {/* Search and controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
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
            <button
              onClick={handleNewCertificate}
              className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
            >
              <FiPlus className="inline-block mr-2" />
              New Certificate
            </button>
            <button
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <FiDownload className="inline-block mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Filters panel - hidden by default */}
        {filterOpen && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]">
                  <option>All Courses</option>
                  <option>Introduction to React</option>
                  <option>Advanced JavaScript</option>
                  <option>UX/UI Design Fundamentals</option>
                </select>
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
        
        {/* Certificates list */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCertificates.map((cert) => (
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
                    {cert.issueDate ? 
                      new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 
                      'Not issued'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      {cert.status === 'issued' && (
                        <button 
                          onClick={() => handleViewCertificate(cert.id)}
                          className="text-[#19a4db] hover:text-[#1582af]"
                        >
                          <FiEye />
                        </button>
                      )}
                      {cert.status === 'pending' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <FiCheck />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <FiX />
                          </button>
                        </>
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
        
        {/* Empty state */}
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
    </div>
  );
};

export default Certifications; 