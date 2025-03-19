import React from "react";
import { FiMessageCircle, FiPhone, FiMail, FiHelpCircle } from "react-icons/fi";

const Support = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">Support & Help</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FiMessageCircle className="text-[#19a4db] w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Contact Instructor</h3>
                <p className="text-gray-600 mb-4">Reach out to your course instructors directly for course-related questions.</p>
                <button className="bg-[#19a4db] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Message Instructor
                </button>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FiHelpCircle className="text-purple-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Technical Support</h3>
                <p className="text-gray-600 mb-4">Having issues with the platform? Get technical help from our support team.</p>
                <button className="bg-[#19a4db] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="border border-gray-100 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">How do I submit assignments?</summary>
              <p className="mt-2 text-gray-600">
                Navigate to your course page, locate the assignment section, and click on "Submit Assignment". You can then upload your work as instructed.
              </p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">How are courses graded?</summary>
              <p className="mt-2 text-gray-600">
                Courses are typically graded based on assignments, quizzes, participation, and final projects or exams. Specific grading criteria are provided by each instructor.
              </p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Can I download course materials?</summary>
              <p className="mt-2 text-gray-600">
                Yes, most course materials can be downloaded for offline study. Look for the download button next to lecture materials.
              </p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">How do I get a certificate?</summary>
              <p className="mt-2 text-gray-600">
                Certificates are automatically issued once you complete all course requirements. You can view and download your certificates from the Certificates section.
              </p>
            </details>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Contact Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center p-4 border border-gray-100 rounded-lg">
              <FiPhone className="text-[#19a4db] w-5 h-5 mr-3" />
              <span className="text-gray-700">+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center p-4 border border-gray-100 rounded-lg">
              <FiMail className="text-[#19a4db] w-5 h-5 mr-3" />
              <span className="text-gray-700">support@edulearn.com</span>
            </div>
            <div className="flex items-center p-4 border border-gray-100 rounded-lg">
              <FiMessageCircle className="text-[#19a4db] w-5 h-5 mr-3" />
              <span className="text-gray-700">Live Chat (9AM-5PM)</span>
            </div>
          </div>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19a4db]" rows="4"></textarea>
            </div>
            <button type="submit" className="px-4 py-2 bg-[#19a4db] text-white rounded-lg text-sm font-medium">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support; 