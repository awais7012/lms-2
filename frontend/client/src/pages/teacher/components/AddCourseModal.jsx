import React, { useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import axios from "axios";

const AddCourseModal = ({ isOpen, onClose, onSubmit }) => {
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // Form state
  const [courseForm, setCourseForm] = useState({
    name: "",
    code: "",
    maxStudents: "",
    price: "",
    duration: "",
    difficultyLevel: "beginner",
    category: "",
    instructorName: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courseName", courseForm.name);
      formData.append("courseCode", courseForm.code);
      formData.append("maxStudents", courseForm.maxStudents);
      formData.append("price", courseForm.price);
      formData.append("duration", courseForm.duration);
      formData.append("difficulty", courseForm.difficultyLevel);
      formData.append("category", courseForm.category);
      formData.append("instructorName", courseForm.instructorName);
      formData.append("description", courseForm.description);
  
      if (courseImage) {
        formData.append("thumbnail", courseImage);
      }
  
      const token = localStorage.getItem("accessToken");
  
      const response = await axios.post(
        `${BASE_URL}/api/courses/addCourse`, // Ensure this matches your backend route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      onSubmit(response.data.course);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };
  
  const resetForm = () => {
    setCourseForm({
      name: "",
      code: "",
      maxStudents: "",
      price: "",
      duration: "",
      difficultyLevel: "beginner",
      category: "",
      instructorName: "",
      description: "",
    });
    setCourseImage(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 md:mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Add New Course
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Course Info - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={courseForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., Introduction to React"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code*
                </label>
                <input
                  type="text"
                  name="code"
                  value={courseForm.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., CS101"
                />
              </div>
            </div>

            {/* Course Details - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Students*
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={courseForm.maxStudents}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)*
                </label>
                <input
                  type="number"
                  name="price"
                  value={courseForm.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., 1999"
                />
              </div>
            </div>

            {/* More Course Details - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (weeks)*
                </label>
                <input
                  type="number"
                  name="duration"
                  value={courseForm.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., 8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level*
                </label>
                <select
                  name="difficultyLevel"
                  value={courseForm.difficultyLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Category and Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <input
                  type="text"
                  name="category"
                  value={courseForm.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Name*
                </label>
                <input
                  type="text"
                  name="instructorName"
                  value={courseForm.instructorName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  placeholder="e.g., Dr. Jane Smith"
                />
              </div>
            </div>

            {/* Course Image */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Thumbnail
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Course thumbnail preview"
                        className="mx-auto h-32 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCourseImage(null);
                          setImagePreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Course Description - Full Width */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description*
              </label>
              <textarea
                name="description"
                value={courseForm.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                placeholder="Provide a detailed description of your course"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1582af]"
              >
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
