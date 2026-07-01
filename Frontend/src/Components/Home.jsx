import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);

      localStorage.removeItem("user");
      setIsLoggedIn(false);

      navigate("/login");
    } catch (error) {
      console.log("Logout Error:", error);

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

        setCourses(
          Array.isArray(res.data.courses)
            ? res.data.courses
            : []
        );
      } catch (error) {
        console.log(
          "Fetching Error:",
          error?.response?.data || error.message
        );
      }
    };

    fetchCourses();
  }, []);

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
  {/* Background Blur */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[140px] rounded-full"></div>

  {/* Navbar */}
  <nav className="relative z-10 flex justify-between items-center px-8 lg:px-16 py-6 backdrop-blur-md border-b border-white/10">
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
      CourseHaven
    </h1>

    <div className="flex gap-4">
      {isLoggedIn ? (
        <button
          onClick={handleLogOut}
          className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-105"
        >
          Logout
        </button>
      ) : (
        <>
          <Link
            to="/login"
            className="px-6 py-2 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Signup
          </Link>
        </>
      )}
    </div>
  </nav>

  {/* Hero Section */}
  <section className="relative z-10 text-center py-24 px-6">
    <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
      Learn From
      <span className="block bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-500 bg-clip-text text-transparent">
        Industry Experts
      </span>
    </h1>

    <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
      Discover high-quality online courses designed to boost your skills,
      advance your career, and help you achieve your dreams.
    </p>

    <div className="mt-10 flex justify-center flex-wrap gap-5">
      <Link
        to="/courses"
        className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition-all duration-300 shadow-xl"
      >
        Explore Courses
      </Link>

      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 rounded-xl bg-white text-black hover:bg-gray-200 transition-all duration-300 shadow-xl"
      >
        Course Videos
      </a>
    </div>
  </section>

  {/* Courses */}
  <section className="relative z-10 py-16">
    <div className="w-11/12 mx-auto">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">Popular Courses</h2>
        <p className="text-gray-400 mt-2">
          Start learning from our best-selling courses.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={25}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <SwiperSlide key={course?._id || index}>
              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">

                {course?.image?.url && (
                  <img
                    src={course.image.url}
                    alt={
                      course.title ||
                      course.courseName ||
                      "Course"
                    }
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-5">

                  <h2 className="text-xl font-bold text-white line-clamp-2">
                    {course?.title ||
                      course?.courseName ||
                      course?.name ||
                      "Untitled Course"}
                  </h2>

                  
                    <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg">
                      View Course
                    </button>
                  

                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 text-center border border-white/10">
              No Courses Available
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  </section>

  {/* Footer */}
  <footer className="relative z-10 mt-20 border-t border-white/10 backdrop-blur-md">
    <div className="w-11/12 mx-auto py-14 grid md:grid-cols-3 gap-10">

      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
          CourseHaven
        </h2>

        <p className="text-gray-400 mt-4">
          Learn. Grow. Succeed.
        </p>

        <div className="flex gap-5 mt-6 text-3xl">
          <div className="p-3 rounded-full bg-white/10 hover:bg-blue-500 transition">
            <FaTwitter />
          </div>

          <div className="p-3 rounded-full bg-white/10 hover:bg-pink-500 transition">
            <FaInstagram />
          </div>

          <div className="p-3 rounded-full bg-white/10 hover:bg-blue-700 transition">
            <FaFacebook />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-5">
          Connect With Us
        </h3>

        <div className="space-y-3 text-gray-300">
          <p>📺 YouTube - Gaurav Pawar</p>
          <p>📱 Telegram - Gaurav Pawar</p>
          <p>💼 LinkedIn - Gaurav Pawar</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-5">
          Legal
        </h3>

        <div className="space-y-3 text-gray-300">
          <p>© 2026 CourseHaven</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
        </div>
      </div>

    </div>
  </footer>
</div>
  );
};

export default Home;