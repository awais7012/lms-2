import React, { useState } from 'react';
import { FiCalendar, FiClock, FiPlus, FiEdit, FiTrash2, FiUsers, FiMapPin, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Scheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for scheduled classes
  const scheduledClasses = [
    {
      id: 'SCH-001',
      course: 'Introduction to React',
      instructor: 'Dr. Amita Verma',
      room: 'Room 101',
      date: '2023-06-12',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      attendees: 35,
      type: 'lecture',
      recurring: true
    },
    {
      id: 'SCH-002',
      course: 'Advanced JavaScript',
      instructor: 'Prof. Aryan Shah',
      room: 'Online',
      date: '2023-06-12',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      attendees: 28,
      type: 'workshop',
      recurring: false
    },
    {
      id: 'SCH-003',
      course: 'UX/UI Design Fundamentals',
      instructor: 'Dr. Nandini Gupta',
      room: 'Design Lab',
      date: '2023-06-13',
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      attendees: 30,
      type: 'lab',
      recurring: true
    },
    {
      id: 'SCH-004',
      course: 'Python for Data Science',
      instructor: 'Dr. Sanjay Mehta',
      room: 'Room 203',
      date: '2023-06-13',
      startTime: '1:00 PM',
      endTime: '3:00 PM',
      attendees: 42,
      type: 'lecture',
      recurring: true
    },
    {
      id: 'SCH-005',
      course: 'Mobile App Development',
      instructor: 'Prof. Meera Kapoor',
      room: 'Computer Lab 2',
      date: '2023-06-14',
      startTime: '10:00 AM',
      endTime: '12:30 PM',
      attendees: 25,
      type: 'lab',
      recurring: true
    },
    {
      id: 'SCH-006',
      course: 'Responsive Web Design',
      instructor: 'Leela Devi',
      room: 'Online',
      date: '2023-06-14',
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      attendees: 20,
      type: 'workshop',
      recurring: false
    },
    {
      id: 'SCH-007',
      course: 'Introduction to React',
      instructor: 'Dr. Amita Verma',
      room: 'Room 101',
      date: '2023-06-15',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      attendees: 35,
      type: 'lecture',
      recurring: true
    },
    {
      id: 'SCH-008',
      course: 'Advanced JavaScript',
      instructor: 'Prof. Aryan Shah',
      room: 'Online',
      date: '2023-06-16',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      attendees: 28,
      type: 'workshop',
      recurring: false
    }
  ];

  // Mock time slots for the calendar
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  
  // Mock days for the weekly view
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Filter classes based on search term
  const filteredClasses = scheduledClasses.filter(cls => 
    cls.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAddSchedule = () => {
    alert('Add schedule functionality will be implemented here');
  };

  // Format date as readable string
  const formatDateRange = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Simplified rendering based on view type
  const renderScheduleView = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <button onClick={handlePrevious} className="mr-4 p-2 hover:bg-gray-100 rounded-full">
                <FiChevronLeft className="text-gray-500" />
              </button>
              <h3 className="text-lg font-bold">{formatDateRange()}</h3>
              <button onClick={handleNext} className="ml-4 p-2 hover:bg-gray-100 rounded-full">
                <FiChevronRight className="text-gray-500" />
              </button>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === 'day' ? 'bg-[#19a4db] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === 'week' ? 'bg-[#19a4db] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === 'month' ? 'bg-[#19a4db] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
        
        {view === 'week' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="w-20 border-r border-gray-200"></th>
                  {weekDays.map(day => (
                    <th key={day} className="border-b border-gray-200 py-4 px-6 text-center">
                      <div className="font-medium text-gray-700">{day}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b border-gray-100">
                    <td className="py-4 px-4 border-r border-gray-200 text-gray-500 text-sm font-medium">
                      {time}
                    </td>
                    {weekDays.map(day => (
                      <td key={`${day}-${time}`} className="border-r border-gray-100 p-2 relative h-20">
                        {/* Here we would match classes that fall in this time slot */}
                        {day === 'Monday' && time === '10:00 AM' && (
                          <div className="absolute inset-0 m-1 bg-blue-100 border-l-4 border-blue-500 rounded p-2 overflow-hidden">
                            <div className="text-sm font-medium text-blue-800 truncate">Introduction to React</div>
                            <div className="text-xs text-blue-600 truncate">Dr. Amita Verma • Room 101</div>
                          </div>
                        )}
                        {day === 'Monday' && time === '2:00 PM' && (
                          <div className="absolute inset-0 m-1 bg-purple-100 border-l-4 border-purple-500 rounded p-2 overflow-hidden">
                            <div className="text-sm font-medium text-purple-800 truncate">Advanced JavaScript</div>
                            <div className="text-xs text-purple-600 truncate">Prof. Aryan Shah • Online</div>
                          </div>
                        )}
                        {day === 'Tuesday' && time === '9:00 AM' && (
                          <div className="absolute inset-0 m-1 bg-green-100 border-l-4 border-green-500 rounded p-2 overflow-hidden">
                            <div className="text-sm font-medium text-green-800 truncate">UX/UI Design</div>
                            <div className="text-xs text-green-600 truncate">Dr. Nandini Gupta • Design Lab</div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {view !== 'week' && (
          <div className="p-8 text-center text-gray-500">
            {view === 'day' ? "Daily view calendar will be displayed here" : "Monthly view calendar will be displayed here"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scheduling & Planning</h1>
        <button 
          onClick={handleAddSchedule}
          className="flex items-center px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium hover:bg-[#1582af]"
        >
          <FiPlus className="mr-2" />
          Add Class
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <FiCalendar className="text-[#19a4db] mr-2" />
            <span className="text-gray-700 font-medium">Class Schedule</span>
          </div>

          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {renderScheduleView()}

      {/* Upcoming Classes */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Upcoming Classes</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Instructor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClasses.slice(0, 5).map((cls) => (
                <tr key={cls.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{cls.course}</div>
                      <div className="text-sm text-gray-500">{cls.instructor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(cls.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cls.startTime} - {cls.endTime}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiMapPin className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{cls.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      cls.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                      cls.type === 'workshop' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                    </span>
                    {cls.recurring && (
                      <span className="ml-2 text-xs text-gray-500">Recurring</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUsers className="text-gray-400 mr-1" />
                      <span>{cls.attendees}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#19a4db] hover:text-[#1582af] mr-3">
                      <FiEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scheduling; 