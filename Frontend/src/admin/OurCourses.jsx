import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/utils";

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
   
    const token = localStorage.getItem("admin");
    if(!token){
      toast.error("Please login to admin")
      navigate("/admin/login")
    }


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL }/courseName/course`,
          {
            withCredentials: true,
          }
        );

        console.log(res.data);

        setCourses(res.data.courses || []);
      } catch (error) {
        console.log(
          "Fetching Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);


    // delete couses data
    const handleDeleteCourse = async (id) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    const response = await axios.delete(
      `${BACKEND_URL }/courseName/delete/${id}`,
       
      {
        headers: {
                Authorization: `Bearer ${token}`,
              },
      
        withCredentials: true,
      }
    );

    alert(response.data.message);

    setCourses((prevCourses) =>
  prevCourses.filter((course) => course._id !== id)
);
  } catch (error) {
    console.log(error);
    alert(
      error?.response?.data?.message ||
        "Failed to delete course"
    );
  }
};



  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 p-8">
  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-center mb-10">
    <h1 className="text-5xl font-extrabold text-gray-800">
      📚 Our Courses
    </h1>

    <Link
      to="/admin/dashboard"
      className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300"
    >
      ← Dashboard
    </Link>
  </div>

  {loading ? (
    <div className="flex justify-center items-center h-96">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  ) : (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div
          key={course._id}
          className="group bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
        >
          {/* Image */}
          <div className="overflow-hidden relative">
            <img
              src={
                course?.image?.url ||
                "https://via.placeholder.com/400x250"
              }
              alt={course.title}
              className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
              Bestseller
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition">
              {course.title}
            </h2>

            <p className="text-gray-600 line-clamp-3 mb-5">
              {course.description}
            </p>

            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-3xl font-bold text-indigo-600">
                  ₹{course.price}
                </span>

                {course.originalPrice && (
                  <span className="line-through text-gray-400 ml-2">
                    ₹{course.originalPrice}
                  </span>
                )}
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                10% OFF
              </span>
            </div>

            <div className="flex gap-4">
              <Link   to={`/admin/update-course/${course._id}`} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-md">
                ✏ Update
              </Link>

              <button   onClick={() => handleDeleteCourse(course._id)}  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-md">
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {!loading && courses.length === 0 && (
    <div className="text-center py-24">
      <h2 className="text-4xl font-bold text-gray-500">
        📭 No Courses Found
      </h2>
    </div>
  )}
</div>
  );
};

export default OurCourses;