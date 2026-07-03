import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/utils";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL }/user/admin/logout`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Logout Successfully");

      // Remove admin data from localStorage
      localStorage.removeItem("admin");

      
    } catch (error) {
      console.log("Logout Error:", error);

      toast.error(
        error.response?.data?.message || "Logout Failed"
      );
    }
  };

  return (
<div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">

  {/* Sidebar */}
  <div className="w-full lg:w-64 bg-white shadow-lg flex flex-col items-center py-6">

    {/* Profile */}
    <img
      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      alt="Admin"
      className="w-24 h-24 rounded-full border-4 border-green-500 transition-all duration-500 hover:scale-110 hover:rotate-6 hover:shadow-2xl"
    />

    <h2 className="mt-4 text-2xl font-bold text-gray-800">
      I'm Admin
    </h2>

    <p className="text-gray-500 text-sm">
      Dashboard
    </p>

    {/* Menu */}
    <div className="w-full px-5 mt-8 space-y-3">

      <Link to="/admin/our-courses">
        <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
          Our Courses
        </button>
      </Link>

      <Link to="/admin/create-course">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
          Create Course
        </button>
      </Link>

      <Link to="/">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
          Home
        </button>
      </Link>

      <button
        onClick={handleLogOut}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
      >
        Logout
      </button>

    </div>

  </div>

  {/* Main Content */}
  <div className="flex-1 flex items-center justify-center p-6">

    <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 w-full max-w-3xl text-center">

      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 animate-bounce">
        Welcome!!!
      </h1>

      <p className="mt-4 text-gray-500 text-lg">
        Admin Dashboard
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">

        <Link to="/admin/our-courses">
          <div className="bg-green-100 hover:bg-green-200 p-6 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <h2 className="text-2xl font-bold text-green-700">
              📚 Courses
            </h2>
            <p className="text-gray-600 mt-2">
              Manage all available courses.
            </p>
          </div>
        </Link>

        <Link to="/admin/create-course">
          <div className="bg-orange-100 hover:bg-orange-200 p-6 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
            <h2 className="text-2xl font-bold text-orange-600">
              ➕ Create Course
            </h2>
            <p className="text-gray-600 mt-2">
              Add new courses for students.
            </p>
          </div>
        </Link>

        <Link to="/">
          <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 cursor-pointer sm:col-span-2">
            <h2 className="text-2xl font-bold text-blue-600">
              🏠 Home
            </h2>
            <p className="text-gray-600 mt-2">
              Return to the home page.
            </p>
          </div>
        </Link>

      </div>

    </div>

  </div>

</div>
  );
};

export default Dashboard;