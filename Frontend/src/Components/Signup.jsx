import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navbar } from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${BACKEND_URL}/user/signup`,
      {
        firstName,
        lastName,
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

    console.log("Signup successfully", response.data);
    alert("Signup successfully");
    navigate("/login")
    

  } catch (error) {
    console.error(error);

    if (error.response) {
      setErrorMessage(error.response.data.error || "Signup failed");
    } 
    
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-blue-900">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md sm:max-w-lg bg-[#0B1220]/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8">
          
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome to{" "}
              <span className="text-orange-500">CourseHaven</span>
            </h1>

            <p className="text-gray-400 mt-3 text-sm sm:text-base">
              Create your account and start learning today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* First Name */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1A2234] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1A2234] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A2234] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
                  {errorMessage && (
              <p className="text-red-500 text-center text-sm">
                {errorMessage}
              </p>
            )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

              {errorMessage && (
              <p className="text-red-500 text-center text-sm">
                {errorMessage}
              </p>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-300"
            >
              Create Account
            </button>
          </form>

        

       
         

          {/* Login Link */}
         
        </div>
      </div>
    </div>
  );
};

export default Signup;