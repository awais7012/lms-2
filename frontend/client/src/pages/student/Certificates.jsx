import React, { useState, useEffect } from "react";
import { FiDownload, FiShare2 } from "react-icons/fi";
import axios from "axios";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/api/certificates/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Certificates</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Earned Certificates</h2>
        </div>
        {isLoading ? (
          <p className="text-center py-6">Loading certificates...</p>
        ) : certificates.length > 0 ? (
          <div className="space-y-4">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{certificate.title}</h3>
                    <p className="text-gray-600 mt-1">Instructor: {certificate.course.instructor}</p>
                    <div className="flex mt-2 space-x-4">
                      <p className="text-sm text-gray-500">ID: {certificate.credential_id}</p>
                      <p className="text-sm text-gray-500">Completed: {certificate.completion_date}</p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                    <div className="mt-3 flex space-x-2">
                      <a href={certificate.certificate_url} download className="flex items-center text-sm bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
                        <FiDownload className="mr-1" />
                        Download
                      </a>
                      <button className="flex items-center text-sm border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50">
                        <FiShare2 className="mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No certificates yet</h3>
            <p className="mt-1 text-gray-500">Complete a course to earn your first certificate!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
