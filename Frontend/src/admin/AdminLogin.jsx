import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../Components/Navbar";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/utils";

const  AdminLogin= () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_URL }/user/admin/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/admin/dashboard");
      console.log(response.status);
      console.log(response.data);
    toast.success("Login Successfully!");
    
      
   localStorage.setItem("admin", response.data.token);

      setEmail("");
      setPassword("");
      setErrorMessage("");

   
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.error || "Login Failed";

      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-[#0B1220]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8">
          
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome Back to{" "}
              <span className="text-orange-500">CourseHaven</span>
            </h1>

            <p className="text-gray-400 mt-3">
              Login in to access admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1A2234] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#1A2234] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-center text-sm">
                {errorMessage}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-300"
            >
              AdminLogin
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;