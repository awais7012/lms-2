import React, { useState, useEffect } from "react";
import { FiFile, FiDownload, FiUpload, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${BASE_URL}/api/assignments/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(response.data.assignments || []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const submitAssignment = async (assignmentId) => {
    if (!selectedFile) {
      alert("Please select a file to submit.");
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("submission_file", selectedFile);
      const response = await axios.post(
        `${BASE_URL}/api/assignments/${assignmentId}/submit`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      alert(response.data.message);
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === assignmentId
            ? { ...assignment, submitted: true }
            : assignment
        )
      );
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment.");
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold">Assignments</h2>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-center py-12">Loading assignments...</p>
          ) : assignments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  console.log(assignment),
                  <tr key={assignment._id}>
                    <td className="px-6 py-4">{assignment.title}</td>
                    <td className="px-6 py-4">{new Date(assignment.deadline).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {assignment.submitted
                        ? assignment.submission.status === "Graded"
                          ? "Graded"
                          : "Submitted"
                        : "Pending"}
                    </td>
                    <td className="px-6 py-4">
                      {assignment.submission.status === "Graded" ? assignment.submission.score : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {assignment.submitted ? (
                        <FiCheckCircle className="text-green-500" size={20} />
                      ) : (
                        <>
                          <input type="file" onChange={handleFileChange} />
                          <button
                            onClick={() => submitAssignment(assignment._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-12">No assignments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
