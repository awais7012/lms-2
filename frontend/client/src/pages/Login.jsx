import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/logo.png";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success("Login successful!");
      
      if (formData.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Redirecting to Google login...");
    console.log("Logging in with Google...");
    navigate("/student-dashboard");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="h-screen w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left Section - Branding */}
          <div className="bg-gradient-to-br from-[#19a4db] to-[#6dc9f1] p-6 lg:p-8 xl:p-10 text-white relative overflow-hidden h-full">
            {/* Decorative circles */}
            <div className="absolute -left-20 -top-20 w-56 h-56 rounded-full bg-white/10"></div>
            <div className="absolute -right-32 top-1/3 w-80 h-80 rounded-full bg-white/10"></div>
            <div className="absolute left-20 bottom-20 w-40 h-40 rounded-full bg-white/10"></div>

            {/* Logo */}
            <div className="relative z-10 mb-16">
              <img src={Logo} alt="VMTA" className="h-16" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
              <p className="text-white/90 mb-16">
                Sign in to continue your learning journey
              </p>

              {/* Features */}
              <div className="space-y-6 mt-20">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Access Your Courses</h3>
                    <p className="text-sm text-white/70">
                      Resume where you left off
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Track Your Progress</h3>
                    <p className="text-sm text-white/70">
                      View assignments and grades
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Connect With Peers</h3>
                    <p className="text-sm text-white/70">
                      Collaborate with classmates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex flex-col pt-16 px-4 overflow-y-auto">
            <div className="max-w-lg mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Login to Your Account
              </h2>
              <p className="text-gray-600 mb-8">
                Enter your credentials to continue
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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

                {/* Email/Username Input */}
                <div>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email or Username"
                      className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
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

                {/* Role Selection */}
                <div>
                  <p className="text-gray-700 mb-2">Login as</p>
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-[#19a4db] focus:ring-[#19a4db] border-gray-300 rounded"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#19a4db] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-[#19a4db] text-white rounded-lg hover:bg-[#1483b0] transition-colors"
                >
                  Login
                </button>

                {/* Signup link */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-[#19a4db] hover:underline">
                    Sign up
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

export default Login;