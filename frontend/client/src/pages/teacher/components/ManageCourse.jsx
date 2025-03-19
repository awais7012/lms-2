import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiAward,
  FiArrowLeft,
  FiSave,
  FiUpload,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiLink,
  FiVideo,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiClock,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ManageCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Add modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "pdf",
    url: "",
    file: null,
    duration: "",
    size: "",
  });

  // Add these new state variables
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    duration: "",
    description: "",
    material: null,
    materialType: "none", // none, video, pdf, link
    materialName: "",
    materialUrl: "",
  });

  const [course, setCourse] = useState({
    name: "",
    code: "",
    maxStudents: "",
    price: "",
    duration: "",
    difficultyLevel: "beginner",
    category: "",
    instructorName: "",
    description: "",
    hasModules: false,
    hasQuizzes: false,
    certificateOffered: false,
    certificateTitle: "",
    certificateDescription: "",
    certificateTemplate: "",
  });

  // Add this to your state declarations
  const [modules, setModules] = useState([]);
  console.log("modules here", modules);

  const [materials, setMaterials] = useState([]);

  // Load course data when component mounts
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:5000/api/courses/${courseId}/manage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourse(response.data.course);
        setModules(response.data.course.modules || []);
        console.log(response.data.course.modules);
        setMaterials(response.data.course.materials || []);
        console.log(response.data.course);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (e) => {
    const { name, checked } = e.target;
    setCourse((prev) => ({ ...prev, [name]: checked }));
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

  const removeImage = () => {
    setCourseImage(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:5000/api/courses/${courseId}/manage`,
        course,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Course updated successfully!");
      navigate("/teacher-dashboard/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course.");
    } finally {
      setIsSaving(false);
    }
  };

  // Add these functions to handle modules and lessons
  // const toggleModule = (moduleId) => {
  //   console.log(moduleId);
  //   setModules(
  //     modules.map((module) =>
  //       module.id === moduleId
  //         ? { ...module, expanded: !module.expanded }
  //         : module
  //     )
  //   );
  // };

  const toggleModule = (moduleId) => {
    console.log(moduleId);
    setModules(
      modules.map((module) => {
        if (module._id === moduleId) {
          console.log(module.id); // Optional: Log the module ID if needed
          return { ...module, expanded: !module.expanded };
        } else {
          return module;
        }
      })
    );
  };

  const addNewModule = () => {
    const newModule = {
      id: Date.now(),
      title: "New Module",
      expanded: true,
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const openEditLessonModal = (moduleId, lesson) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lesson.id);
    setIsEditingLesson(true);

    // Populate the form with existing lesson data
    setNewLesson({
      title: lesson.title || "",
      duration: lesson.duration || "",
      description: lesson.description || "",
      material: null, // Can't restore the actual file object
      materialType: lesson.materialType || "none",
      materialName: lesson.materialName || "",
      materialUrl: lesson.materialUrl || "",
    });

    setIsLessonModalOpen(true);
  };

  const openLessonModal = (moduleId) => {
    console.log(moduleId);
    setCurrentModuleId(moduleId);
    setCurrentLessonId(null);
    setIsEditingLesson(false);

    // Reset the form for adding a new lesson
    setNewLesson({
      title: "",
      duration: "",
      description: "",
      material: null,
      materialType: "none",
      materialName: "",
      materialUrl: "",
    });

    setIsLessonModalOpen(true);
  };

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonMaterialChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.startsWith("video")
        ? "video"
        : file.type === "application/pdf"
        ? "pdf"
        : "file";

      setNewLesson((prev) => ({
        ...prev,
        material: file,
        materialType: fileType,
        materialName: file.name,
      }));
    }
  };

  const submitLesson = async () => {
    if (!newLesson.title.trim()) {
      alert("Lesson title is required");
      return;
    }

    if (!newLesson.duration.trim()) {
      alert("Lesson duration is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("title", newLesson.title.trim());
      formData.append("duration", newLesson.duration.trim());
      formData.append("description", newLesson.description);
      formData.append("materialType", newLesson.materialType);
      formData.append("materialUrl", newLesson.materialUrl);

      // If a file is uploaded, append it to the form data
      if (newLesson.material) {
        formData.append("material", newLesson.material);
      }

      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/modules/${currentModuleId}/lessons`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setModules(
        modules.map((module) =>
          module._id === currentModuleId
            ? { ...module, lessons: [...module.lessons, response.data.lesson] }
            : module
        )
      );

      // Reset form and close modal
      setNewLesson({
        title: "",
        duration: "",
        description: "",
        material: null,
        materialType: "none",
        materialName: "",
        materialUrl: "",
      });
      setIsLessonModalOpen(false);
      setIsEditingLesson(false);
      setCurrentLessonId(null);
    } catch (error) {
      console.error("Error adding lesson:", error);
      alert("Failed to add lesson.");
    }
  };

  // Update existing addNewLesson function
  const addNewLesson = (moduleId) => {
    openLessonModal(moduleId);
  };

  // Add this function to handle form input changes for the module modal
  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({ ...prev, [name]: value }));
  };

  // Add this function to handle form input changes for the material modal
  const handleMaterialInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaterial((prev) => ({ ...prev, [name]: value }));
  };

  // Add this function to handle file selection for materials
  const handleMaterialFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Update the file field
      setNewMaterial((prev) => ({
        ...prev,
        file: file,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB", // Convert to MB
      }));
    }
  };

  // Add this function to handle submitting the new module
  const submitNewModule = async () => {
    if (!newModule.title.trim()) {
      alert("Module title is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/modules`,
        newModule,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModules([...modules, response.data.module]);
      setNewModule({ title: "", description: "" });
      setIsModuleModalOpen(false);
    } catch (error) {
      console.error("Error adding module:", error);
      alert("Failed to add module.");
    }
  };

  // Add this function to handle submitting the new material
  const submitNewMaterial = () => {
    if (!newMaterial.title.trim()) {
      alert("Material title is required");
      return;
    }

    if (newMaterial.type === "link" && !newMaterial.url.trim()) {
      alert("URL is required for external links");
      return;
    }

    if (
      (newMaterial.type === "pdf" || newMaterial.type === "video") &&
      !newMaterial.file
    ) {
      alert("File is required");
      return;
    }

    const materialToAdd = {
      id: Date.now(),
      title: newMaterial.title,
      type: newMaterial.type,
      url: newMaterial.url,
      size: newMaterial.size,
      duration: newMaterial.duration,
    };

    setMaterials([...materials, materialToAdd]);

    // Reset form and close modal
    setNewMaterial({
      title: "",
      type: "pdf",
      url: "",
      file: null,
      duration: "",
      size: "",
    });
    setIsMaterialModalOpen(false);
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `http://localhost:5000/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the modules state to reflect the deletion
      setModules((prevModules) =>
        prevModules.map((module) => {
          if (module._id === moduleId) {
            return {
              ...module,
              lessons: module.lessons.filter(
                (lesson) => lesson._id !== lessonId
              ),
            };
          }
          return module;
        })
      );

      alert("Lesson deleted successfully");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson");
    }
  };

  console.log(course);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19a4db]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm">
          {/* Main content area */}
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
              Manage Course: {course.courseName}
            </h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("basic")}
                className={`py-3 px-5 font-medium text-sm focus:outline-none ${
                  activeTab === "basic"
                    ? "border-b-2 border-[#19a4db] text-[#19a4db]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveTab("modules")}
                className={`py-3 px-5 font-medium text-sm focus:outline-none ${
                  activeTab === "modules"
                    ? "border-b-2 border-[#19a4db] text-[#19a4db]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Modules
              </button>
              <button
                onClick={() => setActiveTab("certificates")}
                className={`py-3 px-5 font-medium text-sm focus:outline-none ${
                  activeTab === "certificates"
                    ? "border-b-2 border-[#19a4db] text-[#19a4db]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Certificates
              </button>
            </div>

            {/* Basic Info Tab Content */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={course.courseName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>

                  {/* Course Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Code*
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={course.courseCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Max Students */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Students*
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={course.maxStudents}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)*
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={course.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (weeks)*
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={course.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level*
                    </label>
                    <select
                      name="difficultyLevel"
                      value={course.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={course.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>

                  {/* Instructor Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor Name*
                    </label>
                    <input
                      type="text"
                      name="instructorName"
                      value={course.instructorName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      required
                    />
                  </div>
                </div>

                {/* Course Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Thumbnail / Image
                  </label>

                  {course.thumbnail ? (
                    <div className="mt-1 relative border border-gray-200 rounded-lg p-2">
                      <img
                        src={`http://localhost:5000/${course.thumbnail}`}
                        alt="Course thumbnail preview"
                        className="max-h-40 mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="course-image"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af] focus-within:outline-none"
                          >
                            <span>Upload an image</span>
                            <input
                              id="course-image"
                              name="course-image"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description*
                  </label>
                  <textarea
                    name="description"
                    value={course.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    required
                  ></textarea>
                </div>

                {/* Additional Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Features
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasModules"
                        name="hasModules"
                        checked={course.hasModules}
                        onChange={handleCheckChange}
                        className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="hasModules"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Includes Modules
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasQuizzes"
                        name="hasQuizzes"
                        checked={course.hasQuizzes}
                        onChange={handleCheckChange}
                        className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="hasQuizzes"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Includes Quizzes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="certificateOffered"
                        name="certificateOffered"
                        checked={course.certificateOffered}
                        onChange={handleCheckChange}
                        className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="certificateOffered"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Offers Certificate
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Tab Content */}
            {activeTab === "modules" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <button
                    onClick={() => setIsModuleModalOpen(true)}
                    className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm flex items-center"
                  >
                    <FiPlus className="mr-2" />
                    Add Module
                  </button>
                </div>

                {/* Modules/Sections Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Modules / Sections
                  </h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                    {modules.map((module) => (
                      <div
                        key={module._id}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleModule(module._id)}
                        >
                          <div className="flex items-center">
                            {module.expanded ? (
                              <FiChevronDown className="text-gray-500 mr-2" />
                            ) : (
                              <FiChevronRight className="text-gray-500 mr-2" />
                            )}
                            <span className="font-medium">{module.title}</span>
                            <span className="ml-3 text-sm text-gray-500">
                              {module.lessons.length}{" "}
                              {module.lessons.length === 1
                                ? "lesson"
                                : "lessons"}
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-[#19a4db] hover:bg-blue-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                addNewLesson(module.id);
                              }}
                            >
                              <FiPlus size={18} />
                            </button>
                            <button className="p-1 text-gray-500 hover:bg-gray-200 rounded">
                              <FiUpload size={18} />
                            </button>
                          </div>
                        </div>

                        {module.expanded && (
                          <div className="bg-white pl-10 pr-4 py-2 border-t border-gray-100">
                            {module.lessons.length > 0 ? (
                              <ul className="divide-y divide-gray-100">
                                {module.lessons.map((lesson) => (
                                  <li
                                    key={lesson._id}
                                    className="py-3 flex justify-between items-center"
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-3 text-sm text-gray-500">
                                        •
                                      </span>
                                      <span>{lesson.title}</span>
                                      <span className="ml-3 text-xs text-gray-400">
                                        {lesson.duration}
                                      </span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        className="p-1 text-gray-400 hover:text-blue-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditLessonModal(
                                            module._id,
                                            lesson
                                          );
                                        }}
                                      >
                                        <FiEdit size={15} />
                                      </button>
                                      <button
                                        className="p-1 text-gray-400 hover:text-red-500"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteLesson(
                                            module._id,
                                            lesson._id
                                          );
                                        }}
                                      >
                                        <FiTrash2 size={15} />
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="py-3 text-sm text-gray-500 italic">
                                No lessons in this module yet.
                              </p>
                            )}

                            <div className="py-2">
                              <button
                                className="text-sm text-[#19a4db] hover:underline flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLessonModal(module._id);
                                }}
                              >
                                <FiPlus className="mr-1" size={14} />
                                Add lesson
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {modules.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 mb-4">
                          No modules created yet.
                        </p>
                        <button
                          onClick={() => setIsModuleModalOpen(true)}
                          className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm"
                        >
                          Create First Module
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Materials Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Course Materials</h3>
                    <button
                      onClick={() => setIsMaterialModalOpen(true)}
                      className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm flex items-center"
                    >
                      <FiPlus className="mr-2" />
                      Add Material
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    {materials.length > 0 ? (
                      <div className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {materials.map((material) => (
                            <div
                              key={material.id}
                              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
                            >
                              <div className="flex items-start mb-2">
                                {material.type === "pdf" && (
                                  <FiFile
                                    className="text-red-500 mr-3 mt-1 flex-shrink-0"
                                    size={20}
                                  />
                                )}
                                {material.type === "link" && (
                                  <FiLink
                                    className="text-blue-500 mr-3 mt-1 flex-shrink-0"
                                    size={20}
                                  />
                                )}
                                {material.type === "video" && (
                                  <FiVideo
                                    className="text-purple-500 mr-3 mt-1 flex-shrink-0"
                                    size={20}
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {material.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {material.type === "pdf" &&
                                      `PDF • ${material.size}`}
                                    {material.type === "link" &&
                                      "External Resource"}
                                    {material.type === "video" &&
                                      `Video • ${material.duration}`}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-auto pt-2 flex justify-end space-x-1">
                                {material.type === "pdf" && (
                                  <button className="p-1 text-gray-500 hover:text-blue-500">
                                    <FiDownload size={16} />
                                  </button>
                                )}
                                <button className="p-1 text-gray-500 hover:text-blue-500">
                                  <FiEdit size={16} />
                                </button>
                                <button className="p-1 text-gray-500 hover:text-red-500">
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 mb-4">
                          No course materials added yet.
                        </p>
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => {
                              setNewMaterial((prev) => ({
                                ...prev,
                                type: "pdf",
                              }));
                              setIsMaterialModalOpen(true);
                            }}
                            className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm flex items-center"
                          >
                            <FiUpload className="mr-2" />
                            Upload File
                          </button>
                          <button
                            onClick={() => {
                              setNewMaterial((prev) => ({
                                ...prev,
                                type: "link",
                              }));
                              setIsMaterialModalOpen(true);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm flex items-center"
                          >
                            <FiLink className="mr-2" />
                            Add External Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Certificates Tab Content */}
            {activeTab === "certificates" && (
              <div>
                <p className="text-gray-600 mb-4">
                  Configure course completion certificates.
                </p>

                {course.certificateOffered ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Title
                      </label>
                      <input
                        type="text"
                        name="certificateTitle"
                        value={course.certificateTitle}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Description
                      </label>
                      <textarea
                        name="certificateDescription"
                        value={course.certificateDescription}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Template
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <FiAward className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="certificate-template"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af] focus-within:outline-none"
                            >
                              <span>Upload a template</span>
                              <input
                                id="certificate-template"
                                name="certificate-template"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, PSD up to 20MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <FiAward className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Certificate Not Enabled
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Enable certificates in the Basic Info tab to configure
                      them.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCourse((prev) => ({
                          ...prev,
                          certificateOffered: true,
                        }));
                        setActiveTab("basic");
                      }}
                      className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm"
                    >
                      Enable Certificates
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Save and Cancel buttons */}
          <div className="flex justify-between items-center px-8 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => navigate("/teacher-dashboard/courses")}
              className="px-4 py-2 text-gray-700 flex items-center rounded-lg hover:bg-gray-100"
            >
              <FiArrowLeft className="mr-2" />
              Back to Courses
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate("/teacher-dashboard/courses")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`px-6 py-2 bg-[#19a4db] text-white rounded-lg flex items-center ${
                  isSaving
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#1582af]"
                }`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Module</h3>
              <button
                onClick={() => setIsModuleModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newModule.title}
                    onChange={handleModuleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Enter module title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Description
                  </label>
                  <textarea
                    name="description"
                    value={newModule.description}
                    onChange={handleModuleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Describe this module"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsModuleModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitNewModule}
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add Course Material</h3>
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newMaterial.title}
                    onChange={handleMaterialInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Enter material title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Type
                  </label>
                  <select
                    name="type"
                    value={newMaterial.type}
                    onChange={handleMaterialInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="video">Video</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                {newMaterial.type === "link" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL*
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={newMaterial.url}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload File*
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        {newMaterial.type === "pdf" ? (
                          <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                        ) : (
                          <FiVideo className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="material-file"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af] focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="material-file"
                              name="file"
                              type="file"
                              className="sr-only"
                              accept={
                                newMaterial.type === "pdf" ? ".pdf" : "video/*"
                              }
                              onChange={handleMaterialFileChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          {newMaterial.type === "pdf"
                            ? "PDF up to 20MB"
                            : "MP4, WebM up to 100MB"}
                        </p>
                        {newMaterial.file && (
                          <p className="text-sm text-gray-700 font-medium mt-2">
                            {newMaterial.file.name} ({newMaterial.size})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {newMaterial.type === "video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={newMaterial.duration}
                      onChange={handleMaterialInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                      placeholder="e.g. 10:30"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitNewMaterial}
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg"
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {isEditingLesson ? "Edit Lesson" : "Add New Lesson"}
              </h3>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newLesson.title}
                    onChange={handleLessonInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Enter lesson title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FiClock className="mr-2" size={16} />
                      Duration
                    </div>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={newLesson.duration}
                    onChange={handleLessonInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="e.g. 15 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Description
                  </label>
                  <textarea
                    name="description"
                    value={newLesson.description}
                    onChange={handleLessonInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                    placeholder="Describe this lesson"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Material
                  </label>
                  <div className="mt-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="material-none"
                          name="materialType"
                          type="radio"
                          value="none"
                          checked={newLesson.materialType === "none"}
                          onChange={handleLessonInputChange}
                          className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300"
                        />
                        <label
                          htmlFor="material-none"
                          className="ml-2 text-sm text-gray-700"
                        >
                          No material
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="material-file"
                          name="materialType"
                          type="radio"
                          value="file"
                          checked={
                            newLesson.materialType === "pdf" ||
                            newLesson.materialType === "video"
                          }
                          onChange={() =>
                            setNewLesson((prev) => ({
                              ...prev,
                              materialType: "file",
                            }))
                          }
                          className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300"
                        />
                        <label
                          htmlFor="material-file"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Upload file
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="material-link"
                          name="materialType"
                          type="radio"
                          value="link"
                          checked={newLesson.materialType === "link"}
                          onChange={handleLessonInputChange}
                          className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300"
                        />
                        <label
                          htmlFor="material-link"
                          className="ml-2 text-sm text-gray-700"
                        >
                          External link
                        </label>
                      </div>
                    </div>

                    {(newLesson.materialType === "pdf" ||
                      newLesson.materialType === "video" ||
                      newLesson.materialType === "file") && (
                      <div className="mt-2">
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                          <div className="space-y-1 text-center">
                            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label
                                htmlFor="lesson-material-file"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-[#19a4db] hover:text-[#1582af] focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="lesson-material-file"
                                  name="material"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,video/*,image/*,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                  onChange={handleLessonMaterialChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, Video, Documents up to 100MB
                            </p>
                            {newLesson.material && (
                              <p className="text-sm text-gray-700 font-medium mt-2">
                                {newLesson.materialName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {newLesson.materialType === "link" && (
                      <div className="mt-2">
                        <input
                          type="url"
                          name="materialUrl"
                          value={newLesson.materialUrl}
                          onChange={handleLessonInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]"
                          placeholder="https://example.com"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitLesson}
                className="px-4 py-2 bg-[#19a4db] text-white rounded-lg"
              >
                {isEditingLesson ? "Update Lesson" : "Add Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
