import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaHome,
  FaBook,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const Courses = () => {

     const [courses, setCourses] = useState([]);
  const [isLoggedIn,setIsLoggedIn]=useState(false)
  const [Loading,setLoading]=useState(true)
  console.log("courses",courses)
useEffect(() => {
  const token = localStorage.getItem("token");
  

  if (token) {
   
    setIsLoggedIn(true);
  } else {
  
    setIsLoggedIn(false);
  }
}, []);

const handleLogOut = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/user/logout`,
      {
        withCredentials: true,
      }
    );

    toast.success(response.data.message ||" Logout SucessFully");
   
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setIsLoggedIn(false);

    
  } catch (error) {
    console.log("Error in logging out", error);

    toast.error(
      error?.response?.data?.error || "Error in logging out"
    );
  }
};
   

  useEffect(() => {
   const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/courseName/course`,
          {
            withCredentials: true,
          }

        );

        console.log(res.data);
        setLoading(false)
        setCourses(res.data.courses || []);
      } catch (error) {
        console.log(
          "Fetching Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchCourses();
  }, []);
  return (
    <>
   <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex flex-col lg:flex-row">

  {/* Sidebar */}
  <aside className="w-full lg:w-72 bg-white shadow-2xl lg:min-h-screen flex flex-col">

    {/* Profile */}
    <div className="p-8 border-b flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
        <FaUserCircle className="text-6xl text-white" />
      </div>

      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        Guest
      </h2>

      <p className="text-gray-500">
        Student Dashboard
      </p>
    </div>

    {/* Menu */}
    <div className="flex-1 p-5">
      <ul className="space-y-3">

        <Link to="/">
          <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 cursor-pointer">
            <FaHome />
            Home
          </li>
        </Link>

        <Link to="/courses">
          <li className="flex items-center gap-4 p-4 rounded-xl bg-indigo-100 text-indigo-600 font-semibold shadow">
            <FaBook />
            Courses
          </li>
        </Link>

        
          <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 cursor-pointer">
            <FaShoppingCart />
            Purchases
          </li>
      

        {!isLoggedIn && (
          <Link to="/login">
            <li className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-100 hover:text-green-600 transition-all duration-300 cursor-pointer">
              <FaUserCircle />
              Login
            </li>
          </Link>
        )}

      </ul>
    </div>

    {isLoggedIn && (
      <div className="p-5">
        <button
          onClick={handleLogOut}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    )}

  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

    {Loading ? (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <>
        {/* Course Count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Courses
          </h2>

          <span className="bg-indigo-600 text-white px-5 py-2 rounded-full">
            {courses.length} Courses
          </span>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

          {courses.map((course) => (
            <div
              key={course._id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="overflow-hidden">
                <img
                  src={course.image?.url}
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-all duration-500"
                />
              </div>

              <div className="p-6">

                <h2 className="text-2xl font-bold text-gray-800">
                  {course.title}
                </h2>

                <p className="text-gray-500 mt-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mt-5">
                  <span className="text-3xl font-bold text-indigo-600">
                    ₹{course.price}
                  </span>

                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                    Bestseller
                  </span>
                </div>

                <Link
                  to={`/buy/${course._id}`}
                  className="block mt-6 text-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Buy Now
                </Link>

              </div>
            </div>
          ))}

        </div>
      </>
    )}

  </main>

</div>

      </>

    )}

    


export default Courses;