import React, { useState } from "react";
import { 
  FiPlus, FiUpload, FiFile, FiVideo, FiLink, FiFileText, 
  FiDownload, FiEdit, FiTrash2, FiEye, FiFolder 
} from "react-icons/fi";

const Materials = () => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock courses
  const courses = [
    { id: "1", name: "Introduction to React" },
    { id: "2", name: "Advanced JavaScript" },
    { id: "3", name: "UX/UI Design Fundamentals" }
  ];
  
  // Mock materials data - would come from API in real app
  const materialsData = [
    {
      id: 1,
      title: "React Components Overview",
      type: "document",
      format: "PDF",
      size: "2.3 MB",
      uploadedOn: "May 10, 2023",
      module: "Module 1: Fundamentals",
      accessCount: 28
    },
    {
      id: 2,
      title: "Introduction to JSX",
      type: "document",
      format: "PDF",
      size: "1.5 MB",
      uploadedOn: "May 10, 2023",
      module: "Module 1: Fundamentals",
      accessCount: 25
    },
    {
      id: 3,
      title: "React Hooks Tutorial",
      type: "video",
      format: "MP4",
      size: "45 MB",
      uploadedOn: "May 12, 2023",
      module: "Module 2: Advanced Concepts",
      accessCount: 20
    },
    {
      id: 4,
      title: "State Management in React",
      type: "presentation",
      format: "PPTX",
      size: "5.2 MB",
      uploadedOn: "May 15, 2023",
      module: "Module 2: Advanced Concepts",
      accessCount: 18
    },
    {
      id: 5,
      title: "React Router Documentation",
      type: "link",
      format: "URL",
      size: "-",
      uploadedOn: "May 16, 2023",
      module: "Module 3: Routing & Navigation",
      accessCount: 15
    },
    {
      id: 6,
      title: "API Integration Workshop",
      type: "document",
      format: "PDF",
      size: "3.1 MB",
      uploadedOn: "May 18, 2023",
      module: "Module 4: API Integration",
      accessCount: 12
    }
  ];
  
  // Group materials by module
  const moduleGroups = materialsData.reduce((groups, material) => {
    const group = groups[material.module] || [];
    group.push(material);
    groups[material.module] = group;
    return groups;
  }, {});
  
  // Filter materials based on search term
  const filteredMaterials = searchTerm 
    ? materialsData.filter(material => 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.module.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : materialsData;
  
  // Get file icon based on material type
  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return <FiFileText className="text-blue-500" />;
      case "video":
        return <FiVideo className="text-red-500" />;
      case "presentation":
        return <FiFile className="text-orange-500" />;
      case "link":
        return <FiLink className="text-purple-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Course Materials</h2>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">
              <FiUpload className="mr-2" />
              Upload
            </button>
            <button className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm">
              <FiPlus className="mr-2" />
              Add Material
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center space-y-4 md:space-y-0 mb-6">
          <div className="w-full md:w-1/2 relative">
            <input
              type="text"
              placeholder="Search course materials..."
              className="pl-4 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/2 md:pl-4">
            <select
              className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent appearance-none"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {searchTerm ? (
          // When searching, show flat list of results
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(material.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{material.title}</div>
                          <div className="text-xs text-gray-500">{material.format}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {material.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.uploadedOn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button className="text-gray-400 hover:text-[#19a4db]">
                          <FiEye size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-[#19a4db]">
                          <FiDownload size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-[#19a4db]">
                          <FiEdit size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-500">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No materials found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // When not searching, group by module
          <div className="space-y-6">
            {Object.keys(moduleGroups).map((moduleName, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex items-center">
                  <FiFolder className="text-[#19a4db] mr-2" />
                  <h3 className="font-medium text-gray-800">{moduleName}</h3>
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {moduleGroups[moduleName].length} items
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {moduleGroups[moduleName].map((material) => (
                        <tr key={material.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                {getFileIcon(material.type)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{material.title}</div>
                                <div className="text-xs text-gray-500">{material.format}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {material.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {material.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {material.uploadedOn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {material.accessCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2 justify-end">
                              <button className="text-gray-400 hover:text-[#19a4db]">
                                <FiEye size={18} />
                              </button>
                              <button className="text-gray-400 hover:text-[#19a4db]">
                                <FiDownload size={18} />
                              </button>
                              <button className="text-gray-400 hover:text-[#19a4db]">
                                <FiEdit size={18} />
                              </button>
                              <button className="text-gray-400 hover:text-red-500">
                                <FiTrash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials; 