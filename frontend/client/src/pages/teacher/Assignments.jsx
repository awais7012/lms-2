import React, { useState, useEffect } from "react";
import {
  FiFile,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiPlus,
  FiX,
  FiUpload,
  FiAlertCircle,
} from "react-icons/fi";
import axios from "axios";

const Assignments = () => {
  // State for assignments
  const [assignments, setAssignments] = useState([]);
  // State for courses (for dropdown selection)
  const [courses, setCourses] = useState([]);
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);
  const [assignmentFile, setAssignmentFile] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // State for new/edited assignment form
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    courseId: "",
    courseName: "",
    description: "",
    deadline: "",
    attachments: [],
  });

  // Add new state for submissions and modal
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

  // Fetch assignments and courses when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");

        // Fetch teacher's assignments
        const assignmentsResponse = await axios.get(
          `${BASE_URL}/api/assignments/teacher`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch teacher's courses for the dropdown
        const coursesResponse = await axios.get(
          `${BASE_URL}/api/courses/teacher/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignments(assignmentsResponse.data.assignments || []);
        setCourses(coursesResponse.data.courses || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load assignments or courses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Open modal for creating a new assignment
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentAssignmentId(null);
    setAssignmentFile(null);
    setNewAssignment({
      title: "",
      courseId: "",
      courseName: "",
      description: "",
      deadline: "",
      attachments: [],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing assignment
  const openEditModal = (assignment) => {
    setIsEditing(true);
    setCurrentAssignmentId(assignment._id);

    // Format the deadline date for the input field (YYYY-MM-DD)
    const deadlineDate = new Date(assignment.deadline);
    const formattedDeadline = deadlineDate.toISOString().split("T")[0];

    setNewAssignment({
      title: assignment.title,
      courseId: assignment.course._id || assignment.course,
      courseName:
        assignment.courseName ||
        (assignment.course.courseName ? assignment.course.courseName : ""),
      description: assignment.description || "",
      deadline: formattedDeadline,
      attachments: assignment.attachmentFile ? [assignment.attachmentFile] : [],
    });
    setIsModalOpen(true);
  };

  // Handle input changes for assignment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  // Handle course selection change
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedCourse = courses.find((course) => course._id === courseId);

    if (selectedCourse) {
      setNewAssignment((prev) => ({
        ...prev,
        courseId: selectedCourse._id,
        courseName: selectedCourse.courseName,
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAssignmentFile(file);
    }
  };

  // Submit the assignment form (create or update)
  const submitAssignment = async () => {
    if (!newAssignment.title.trim()) {
      alert("Assignment title is required");
      return;
    }

    if (!newAssignment.courseId) {
      alert("Please select a course");
      return;
    }

    if (!newAssignment.deadline) {
      alert("Deadline is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      formData.append("title", newAssignment.title.trim());
      formData.append("courseId", newAssignment.courseId);
      formData.append("courseName", newAssignment.courseName);
      formData.append("deadline", newAssignment.deadline);
      formData.append("description", newAssignment.description);

      // If a file is uploaded, append it to the form data
      if (assignmentFile) {
        formData.append("attachmentFile", assignmentFile);
      }

      let response;

      if (isEditing) {
        // Update existing assignment
        response = await axios.put(
          `${BASE_URL}/api/assignments/${currentAssignmentId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update the assignments list
        setAssignments(
          assignments.map((assignment) =>
            assignment._id === currentAssignmentId
              ? response.data.assignment
              : assignment
          )
        );
      } else {
        // Create new assignment
        response = await axios.post(
          `${BASE_URL}/api/assignments/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Add the new assignment to the list
        setAssignments([...assignments, response.data.assignment]);
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setAssignmentFile(null);
      setNewAssignment({
        title: "",
        courseId: "",
        courseName: "",
        description: "",
        deadline: "",
        attachments: [],
      });

      alert(
        isEditing
          ? "Assignment updated successfully!"
          : "Assignment created successfully!"
      );
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to save assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Delete assignment
  const deleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        const token = localStorage.getItem("accessToken");

        await axios.delete(`${BASE_URL}/api/assignments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Remove the deleted assignment from the list
        setAssignments(
          assignments.filter((assignment) => assignment._id !== id)
        );
        alert("Assignment deleted successfully!");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment. Please try again.");
      }
    }
  };

  // Get file name from path
  const getFileName = (filePath) => {
    if (!filePath) return "";
    return filePath.split("/").pop();
  };

  // Fetch submissions for a specific assignment
  const fetchSubmissions = async (assignmentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${BASE_URL}/api/assignments/submissions/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissions(response.data.submissions || []);
      setSelectedAssignmentId(assignmentId);
      setIsSubmissionsModalOpen(true);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      alert("Failed to load submissions. Please try again.");
    }
  };

  // Grade a submission
  const gradeSubmission = async (studentId, score, feedback) => {
    try {
      const token = localStorage.getItem("accessToken");
  
      const formData = new FormData();
      formData.append("score", score);
      if (feedback) formData.append("feedback", feedback);
  
      await axios.post(
        `${BASE_URL}/api/assignments/${selectedAssignmentId}/grade/${studentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      alert("Submission graded successfully!");
      fetchSubmissions(selectedAssignmentId); // Refresh submissions
    } catch (error) {
      console.error("Error grading submission:", error);
      alert("Failed to grade submission. Please try again.");
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Assignments</h2>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm flex items-center"
          >
            <FiPlus className="mr-2" />
            Create Assignment
          </button>
        </div>

        {/* All Assignments Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19a4db] mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading assignments...</p>
            </div>
          ) : assignments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assignment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deadline
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attachments
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {assignment.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.courseName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {assignment.course && assignment.course.courseCode
                          ? assignment.course.courseCode
                          : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(assignment.deadline)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(assignment.deadline) < new Date() ? (
                          <span className="text-red-500 flex items-center">
                            <FiAlertCircle className="mr-1" size={12} />
                            Past due
                          </span>
                        ) : (
                          "Upcoming"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.submissionCount || 0} /{" "}
                        {assignment.totalStudents || "?"}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#19a4db] h-2 rounded-full"
                          style={{
                            width: assignment.totalStudents
                              ? `${
                                  ((assignment.submissionCount || 0) /
                                    assignment.totalStudents) *
                                  100
                                }%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.attachmentFile ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <FiFile className="mr-2 text-gray-400" />
                          <span className="truncate max-w-xs">
                            {getFileName(assignment.attachmentFile)}
                          </span>
                          <a
                            href={`${BASE_URL}/${assignment.attachmentFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-[#19a4db] hover:text-[#1582af]"
                          >
                            <FiDownload size={16} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No attachments
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => deleteAssignment(assignment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={18} />
                        </button>
                        <button
                          onClick={() => fetchSubmissions(assignment._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Submissions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <FiFile className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No assignments
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new assignment.
              </p>
              <div className="mt-6">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#19a4db] hover:bg-[#1582af]"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  New Assignment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-screen overflow-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {isEditing ? "Edit Assignment" : "Create New Assignment"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newAssignment.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Enter assignment title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course*
                  </label>
                  <select
                    name="courseId"
                    value={newAssignment.courseId}
                    onChange={handleCourseChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName} ({course.courseCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" size={16} />
                      Deadline*
                    </div>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={newAssignment.deadline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Description
                  </label>
                  <textarea
                    name="description"
                    value={newAssignment.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Describe the assignment"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="assignment-file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af] focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="assignment-file"
                            name="file"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, PPT up to 20MB
                      </p>
                      {assignmentFile && (
                        <p className="text-sm text-gray-700 font-medium mt-2">
                          {assignmentFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && newAssignment.attachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Attachment
                    </label>
                    <div className="space-y-2">
                      {newAssignment.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                          <div className="flex items-center">
                            <FiFile className="text-gray-500 mr-2" />
                            <span className="text-sm">{getFileName(file)}</span>
                          </div>
                          <a
                            href={`${BASE_URL}/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#19a4db] hover:text-[#1582af] mr-2"
                          >
                            <FiDownload size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading a new file will replace the current one
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitAssignment}
                className={`px-4 py-2 text-white rounded-lg flex items-center ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#19a4db]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : isEditing ? (
                  "Update Assignment"
                ) : (
                  "Create Assignment"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {isSubmissionsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-screen overflow-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Submissions</h3>
              <button
                onClick={() => setIsSubmissionsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              {submissions.length > 0 ? (
                <ul className="space-y-4">
                  {submissions.map((submission) => (
                    <li
                      key={submission._id}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {submission.studentName}
                        </p>
                        <a
                          href={`${BASE_URL}/${submission.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Download Submission
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          const score = prompt("Enter score:");
                          const feedback = prompt("Enter feedback:");
                          if (score)
                            gradeSubmission(submission.student_id, score, feedback);
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
                      >
                        Grade
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No submissions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;