import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    try {
      await signUp(formData);
      toast.success("Account created successfully! Waiting for approval...");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Sign up failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
  
      toast.info("Redirecting to Google login...");
      console.log("Logging in with Google...");
  
      // Step 1: Redirect to FastAPI Google login
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google/login`;
  
      // Step 2: Wait for redirect & token in URL (polling method)
      const checkToken = async () => {
        while (true) {
          const params = new URLSearchParams(window.location.search);
          const accessToken = params.get("access_token");
  
          if (accessToken) {
            console.log("Google Auth Token Received:", accessToken);
  
            // Step 3: Fetch user details
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
  
            const userData = res.data.user;
  
            // Step 4: Call `login` function from AuthContext
            await login({
              email: userData.email,
              password: null, // No password for Google users
              role: userData.role,
            });
  
            toast.success("Google login successful!");
  
            // Step 5: Redirect based on role
            navigate(userData.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
  
            break; // Exit loop after successful login
          }
  
          await new Promise((resolve) => setTimeout(resolve, 500)); // Poll every 500ms
        }
      };
  
      checkToken();
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="h-screen w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left Section - Branding */}
          <div className="bg-gradient-to-br from-[#19a4db] to-[#6dc9f1] p-6 lg:p-8 xl:p-10 text-white relative overflow-hidden h-full">
            {/* Decorative circles - made smaller */}
            <div className="absolute -left-20 -top-20 w-56 h-56 rounded-full bg-white/10"></div>
            <div className="absolute -right-32 top-1/3 w-80 h-80 rounded-full bg-white/10"></div>
            <div className="absolute left-20 bottom-20 w-40 h-40 rounded-full bg-white/10"></div>

            {/* Logo */}
            <div className="relative z-10 mb-16">
              <img src={Logo} alt="VMTA" className="h-16" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Create Account</h1>
              <p className="text-white/90 mb-16">
                Join our learning community and start your educational journey
              </p>

              {/* Basic Information Step */}
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#19a4db] font-semibold text-lg">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Basic Information</h3>
                  <p className="text-white/80">
                    Let's start with your basic details
                  </p>
                </div>
              </div>

              {/* Security Step */}
              <div className="flex items-center mb-16">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold text-lg">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Security</h3>
                  <p className="text-white/80">Create a secure password</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-medium">Course Access</h3>
                  <p className="text-sm text-white/80">1000+ courses</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-medium">Community</h3>
                  <p className="text-sm text-white/80">Join study groups</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-medium">Save Favorites</h3>
                  <p className="text-sm text-white/80">Bookmark lessons</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <h3 className="font-medium">Expert Tutors</h3>
                  <p className="text-sm text-white/80">Learn from the best</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex flex-col pt-16 px-4 overflow-y-auto">
            <div className="max-w-lg mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Basic Information
              </h2>
              <p className="text-gray-600 mb-8">
                Let's start with your basic details
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg text-gray-700 bg-white"
                >
                  <FcGoogle className="mr-2 text-xl" />
                  Sign in with Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-sm">
                    or
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Username Input */}
                <div>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="School Email Address"
                      className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <p className="text-gray-700 mb-2">Sign up as</p>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        id="role-student"
                        name="role"
                        type="radio"
                        value="student"
                        checked={formData.role === "student"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300"
                      />
                      <label
                        htmlFor="role-student"
                        className="ml-2 text-gray-700"
                      >
                        Student
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="role-teacher"
                        name="role"
                        type="radio"
                        value="teacher"
                        checked={formData.role === "teacher"}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300"
                      />
                      <label
                        htmlFor="role-teacher"
                        className="ml-2 text-gray-700"
                      >
                        Teacher
                      </label>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full py-3 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full py-3 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Tips Box */}
                <div className="bg-blue-50 p-4 rounded-lg mt-2">
                  <h4 className="font-medium text-gray-800 mb-1">Tips:</h4>
                  <p className="text-blue-700 text-sm">
                    Choose a username that will be visible to your teachers and
                    classmates
                  </p>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  onSubmit={handleSubmit}
                  className="w-full py-3 mt-4 bg-[#19a4db] text-white rounded-lg hover:bg-[#1483b0] transition-colors"
                >
                  Create Account
                </button>

                {/* Login link */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#19a4db] hover:underline">
                    Login
                  </Link>
                </div>

                {/* Spacer div to ensure bottom margin appears */}
                <div className="h-10"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
