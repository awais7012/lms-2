import React from "react";
import { FiBell, FiSearch, FiMenu, FiX } from "react-icons/fi";
import Logo from "../assets/logo.png";

const Header = ({ toggleSidebar, isSidebarOpen, notifications }) => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 text-gray-500 hover:text-[#19a4db] focus:outline-none lg:hidden"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <img src={Logo} alt="EduLearn" className="h-14 -my-2" />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="relative">
          <button className="p-2 text-gray-500 hover:text-[#19a4db] rounded-full hover:bg-gray-100">
            <FiBell />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>
        </div>
        
        <div className="relative">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#19a4db] rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="text-sm text-gray-700 hidden md:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 