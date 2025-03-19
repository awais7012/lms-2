import React from "react";
import { FiDownload, FiShare2 } from "react-icons/fi";

const Certificates = () => {
  // Mock certificates data
  const certificates = [
    {
      id: 1,
      course: "HTML & CSS Foundations",
      issueDate: "Jan 15, 2023",
      status: "Available",
      instructor: "Emma Wilson",
      credentialID: "CERT-HTML-12345",
      completionDate: "Jan 12, 2023",
    },
    {
      id: 2,
      course: "JavaScript Basics",
      issueDate: "Mar 22, 2023",
      status: "Available",
      instructor: "David Brown",
      credentialID: "CERT-JS-67890",
      completionDate: "Mar 20, 2023",
    },
    {
      id: 3,
      course: "React Fundamentals",
      issueDate: "Pending",
      status: "Pending",
      instructor: "Sarah Johnson",
      credentialID: "CERT-REACT-PEND",
      completionDate: "In progress",
      progress: 85,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Certificates</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Earned Certificates</h2>
          <div className="flex space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>All Certificates</option>
              <option>Available</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {certificates.map(certificate => (
            <div 
              key={certificate.id} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="font-semibold text-lg">{certificate.course}</h3>
                  <p className="text-gray-600 mt-1">Instructor: {certificate.instructor}</p>
                  <div className="flex mt-2 space-x-4">
                    <p className="text-sm text-gray-500">
                      ID: {certificate.credentialID}
                    </p>
                    <p className="text-sm text-gray-500">
                      Completed: {certificate.completionDate}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    certificate.status === "Available" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {certificate.status}
                  </span>
                  
                  {certificate.status === "Available" ? (
                    <div className="mt-3 flex space-x-2">
                      <button className="flex items-center text-sm bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                        <FiDownload className="mr-1" />
                        Download
                      </button>
                      <button className="flex items-center text-sm border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50">
                        <FiShare2 className="mr-1" />
                        Share
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 w-full md:w-64">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Course progress</span>
                        <span>{certificate.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${certificate.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {certificates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No certificates yet</h3>
            <p className="mt-1 text-gray-500">Complete a course to earn your first certificate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates; 