import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaHome,
  FaBook,
  FaShoppingCart,
  FaCog,
  FaSignOutAlt,
  FaPlayCircle,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("user");

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);

        // Verify Stripe Payment
        const sessionId = new URLSearchParams(
          window.location.search
        ).get("session_id");

        if (sessionId) {
          await axios.post(
            `${BACKEND_URL}/courseName/verify-payment`,
            { sessionId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          
        }

        // Fetch Purchased Courses
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        setPurchases(response.data.courseData || []);
        toast.success("Payment Successful");
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to load purchases"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [token]);



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

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white shadow-xl">
        {/* Profile */}
        <div className="flex flex-col items-center py-8 border-b">
          <FaUserCircle className="text-7xl text-blue-500" />

          <h2 className="mt-3 text-2xl font-bold">Profile</h2>

          <p className="text-gray-500">Student Dashboard</p>
        </div>

        {/* Menu */}
        <nav className="p-5 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-100 hover:text-blue-600 duration-300"
          >
            <FaHome />
            Home
          </Link>

          <Link
            to="/courses"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-100 hover:text-blue-600 duration-300"
          >
            <FaBook />
            Courses
          </Link>

          <Link
            to="/purchases"
            className="flex items-center gap-3 p-4 rounded-xl bg-blue-100 text-blue-600 font-semibold"
          >
            <FaShoppingCart />
            Purchases
          </Link>

          <button
            onClick={handleLogOut}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-100 hover:text-red-600 duration-300"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 h-screen justify-center items-center">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl text-center font-bold text-gray-800">
            My Purchased Courses
          </h1>

          <p className="text-gray-500 mt-2 text-center">
            Continue learning from your purchased courses.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-600">
              No Purchased Courses
            </h2>

            <p className="text-gray-400 mt-2">
              Purchase a course to start learning.
            </p>

            <Link to="/courses">
              <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                Browse Courses
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {purchases.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >
                <img
                  src={
                    course?.image?.url ||
                    "https://via.placeholder.com/500x300"
                  }
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">
                  <h2 className="text-2xl font-bold">
                    {course.title}
                  </h2>

                  <p className="text-gray-500 mt-3 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{course.price}
                    </span>

                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2">
                      <FaPlayCircle />
                      Learn
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  );
};

export default Purchases;