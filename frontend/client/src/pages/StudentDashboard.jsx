// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import StudentHeader from "../components/StudentHeader";
// import StudentSidebar from "../components/StudentSidebar";
// import Dashboard from "./student/Dashboard";
// import Courses from "./student/Courses";
// import NewCourses from "./student/NewCourses";
// import Progress from "./student/Progress";
// import Certificates from "./student/Certificates";
// import Attendance from "./student/Attendance";
// import Notifications from "./student/Notifications";
// import Support from "./student/Support";

// const StudentDashboard = () => {
//   const userName = localStorage.getItem("userName");

//   // Mock notifications to avoid undefined issues
//   const notifications = [
//     {
//       id: 1,
//       title: "Assignment Due",
//       message: "React Components assignment due tomorrow",
//       time: "2 hours ago",
//     },
//     {
//       id: 2,
//       title: "New Material Available",
//       message: "New lecture notes uploaded for JavaScript course",
//       time: "Yesterday",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <StudentHeader studentName={userName} notifications={notifications} />

//       <div className="pt-16 flex">
//         <StudentSidebar />

//         <main className="flex-1 p-6 overflow-x-hidden">
//           <Routes>
//             <Route path="/" element={<Dashboard studentName={userName} />} />
//             <Route path="courses" element={<Courses />} />
//             <Route path="new-courses" element={<NewCourses />} />
//             <Route path="progress" element={<Progress />} />
//             <Route path="certificates" element={<Certificates />} />
//             <Route path="attendance" element={<Attendance />} />
//             <Route path="notifications" element={<Notifications />} />
//             <Route path="support" element={<Support />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };  

// export default StudentDashboard;

import React from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import StudentSidebar from "../components/StudentSidebar";

const StudentDashboard = () => {
  const userName = localStorage.getItem("userName");

  // Mock notifications to avoid undefined issues
  const notifications = [
    {
      id: 1,
      title: "Assignment Due",
      message: "React Components assignment due tomorrow",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "New Material Available",
      message: "New lecture notes uploaded for JavaScript course",
      time: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <StudentHeader studentName={userName} notifications={notifications} />

      <div className="pt-16 flex">
        <StudentSidebar />

        {/* Render nested routes dynamically */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet /> {/* ✅ This dynamically renders the selected sub-route */}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
