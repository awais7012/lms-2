import React, { useState } from "react";
import { FiDownload, FiUpload, FiFilter, FiSearch, FiEdit, FiCheck, FiX } from "react-icons/fi";

const Grades = () => {
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGrade, setEditingGrade] = useState(null);
  const [newGradeValue, setNewGradeValue] = useState("");
  
  // Mock courses
  const courses = [
    { id: "1", name: "Introduction to React" },
    { id: "2", name: "Advanced JavaScript" },
    { id: "3", name: "UX/UI Design Fundamentals" }
  ];
  
  // Mock grades data - would come from API in real app
  const gradesData = [
    {
      id: 1,
      studentId: "ST-001",
      studentName: "John Doe",
      assignment: "React Components Assignment",
      maxScore: 100,
      score: 85,
      submitted: "May 15, 2023",
      status: "Graded"
    },
    {
      id: 2,
      studentId: "ST-002",
      studentName: "Jane Smith",
      assignment: "React Components Assignment",
      maxScore: 100,
      score: 92,
      submitted: "May 14, 2023",
      status: "Graded"
    },
    {
      id: 3,
      studentId: "ST-003",
      studentName: "Michael Brown",
      assignment: "React Components Assignment",
      maxScore: 100,
      score: 78,
      submitted: "May 15, 2023",
      status: "Graded"
    },
    {
      id: 4,
      studentId: "ST-004",
      studentName: "Emily Wilson",
      assignment: "React Components Assignment",
      maxScore: 100,
      score: 65,
      submitted: "May 16, 2023",
      status: "Graded"
    },
    {
      id: 5,
      studentId: "ST-005",
      studentName: "David Chen",
      assignment: "React Components Assignment",
      maxScore: 100,
      score: 88,
      submitted: "May 15, 2023",
      status: "Graded"
    },
    {
      id: 6,
      studentId: "ST-006",
      studentName: "Sarah Miller",
      assignment: "JavaScript Closures Quiz",
      maxScore: 50,
      score: 42,
      submitted: "May 17, 2023",
      status: "Graded"
    },
    {
      id: 7,
      studentId: "ST-007",
      studentName: "Robert Johnson",
      assignment: "JavaScript Closures Quiz",
      maxScore: 50,
      score: null,
      submitted: "May 17, 2023",
      status: "Pending"
    }
  ];
  
  const handleEditGrade = (id, currentScore) => {
    setEditingGrade(id);
    setNewGradeValue(currentScore !== null ? currentScore.toString() : "");
  };
  
  const handleSaveGrade = (id) => {
    // In a real app, you would make an API call here
    console.log(`Saving grade ${newGradeValue} for ID ${id}`);
    setEditingGrade(null);
  };
  
  const handleCancelEdit = () => {
    setEditingGrade(null);
  };
  
  // Filter grades data based on search term
  const filteredGrades = gradesData.filter(grade => 
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Grades</h2>
          {/* <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">
              <FiDownload className="mr-2" />
              Export Grades
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm">
              <FiUpload className="mr-2" />
              Import Grades
            </button>
          </div> */}
        </div>
        
        <div className="flex flex-wrap items-center space-y-4 md:space-y-0 mb-6">
          <div className="w-full md:w-1/2 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or assignment..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/2 md:pl-4 flex space-x-2">
            <div className="relative w-full">
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent appearance-none"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
              <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Grades Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-blue-600 font-medium">Class Average</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {Math.round(filteredGrades.filter(g => g.score !== null).reduce((acc, grade) => acc + (grade.score / grade.maxScore) * 100, 0) / 
                filteredGrades.filter(g => g.score !== null).length
              )}%
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-sm text-green-600 font-medium">Highest Score</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {Math.max(...filteredGrades.filter(g => g.score !== null).map(g => g.score))}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="text-sm text-yellow-600 font-medium">Pending Grades</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {filteredGrades.filter(g => g.status === "Pending").length}
            </div>
          </div>
        </div>
        
        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#19a4db] flex items-center justify-center text-white font-medium">
                        {grade.studentName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                        <div className="text-xs text-gray-500">{grade.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.assignment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {grade.submitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingGrade === grade.id ? (
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max={grade.maxScore}
                          className="w-16 mr-2 border border-gray-200 rounded px-2 py-1 text-sm"
                          value={newGradeValue}
                          onChange={(e) => setNewGradeValue(e.target.value)}
                        />
                        <span className="text-gray-500">/ {grade.maxScore}</span>
                      </div>
                    ) : (
                      <div className={`${
                        grade.score !== null && (grade.score / grade.maxScore) < 0.6 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {grade.score !== null ? `${grade.score} / ${grade.maxScore}` : '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      grade.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {grade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingGrade === grade.id ? (
                      <div className="flex space-x-2 justify-end">
                        <button 
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleSaveGrade(grade.id)}
                        >
                          <FiCheck size={18} />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={handleCancelEdit}
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="text-[#19a4db] hover:text-[#1483b0]"
                        onClick={() => handleEditGrade(grade.id, grade.score)}
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredGrades.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No grades found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Grades; 