import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import Logo from "../assets/logo.png";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [step, countdown]);

  const startCountdown = () => {
    setCountdown(30);
    setResendDisabled(true);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value && !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      toast.error("Please enter your email address!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setError("");
      setStep(2);
      startCountdown();
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to send OTP!");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setOtp(["", "", "", "", "", ""]);
      startCountdown();
      toast.success("OTP resent successfully!");

      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to resend OTP!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete OTP");
      toast.error("Please enter the complete OTP!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: otpValue }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      setError("");
      setStep(3);
      toast.success("OTP verified successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "OTP verification failed!");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter your new password");
      toast.error("Please enter your new password!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successful!");
      navigate("/login", { state: { passwordReset: true } });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to reset password!");
    }
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
              <h1 className="text-4xl font-bold mb-2">Reset Password</h1>
              <p className="text-white/90 mb-16">
                We'll help you recover your account
              </p>

              {/* Password Recovery Steps */}
              <div className="space-y-8 mt-20">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                      step === 1
                        ? "bg-white text-[#19a4db]"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Verify Email</h3>
                    <p className="text-sm text-white/70">
                      Enter your registered email
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                      step === 2
                        ? "bg-white text-[#19a4db]"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Enter OTP</h3>
                    <p className="text-sm text-white/70">
                      Enter the code sent to your email
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium ${
                      step === 3
                        ? "bg-white text-[#19a4db]"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Create New Password</h3>
                    <p className="text-sm text-white/70">
                      Set a new secure password
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex flex-col pt-16 px-4 overflow-y-auto">
            <div className="max-w-lg mx-auto w-full">
              <button
                onClick={() =>
                  step === 1 ? navigate("/login") : setStep(step - 1)
                }
                className="flex items-center text-gray-600 mb-8 hover:text-[#19a4db]"
              >
                <FiArrowLeft className="mr-2" />
                {step === 1 ? "Back to Login" : "Back"}
              </button>

              {/* Step 1: Email Entry */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Forgot Password
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Enter your email to receive a verification code
                  </p>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                        />
                      </div>
                      {error && (
                        <p className="mt-1 text-red-500 text-sm">{error}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#19a4db] text-white rounded-lg hover:bg-[#1483b0] transition-colors"
                    >
                      Send Verification Code
                    </button>
                  </form>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Verify Your Identity
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Enter the 6-digit code sent to {email}
                  </p>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-4">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 text-center text-xl font-medium bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#19a4db]"
                          />
                        ))}
                      </div>
                      {error && (
                        <p className="mt-1 text-red-500 text-sm">{error}</p>
                      )}
                    </div>

                    <div className="text-center">
                      {resendDisabled ? (
                        <p className="text-gray-500 text-sm">
                          Resend code in {countdown} seconds
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-[#19a4db] text-sm font-medium hover:underline"
                        >
                          Resend verification code
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#19a4db] text-white rounded-lg hover:bg-[#1483b0] transition-colors"
                    >
                      Verify Code
                    </button>
                  </form>
                </>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    Create New Password
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Enter a secure password for your account
                  </p>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* New Password Input */}
                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="New Password"
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
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
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
                    </div>

                    {error && (
                      <p className="mt-1 text-red-500 text-sm">{error}</p>
                    )}

                    {/* Password Tips */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-1">
                        Password tips:
                      </h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Use at least 8 characters</li>
                        <li>• Include uppercase & lowercase letters</li>
                        <li>• Add numbers and special characters</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 mt-2 bg-[#19a4db] text-white rounded-lg hover:bg-[#1483b0] transition-colors"
                    >
                      Reset Password
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
