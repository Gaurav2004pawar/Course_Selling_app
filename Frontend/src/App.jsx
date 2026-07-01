import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Courses from "./Components/Courses";
import Buy from "./Components/Buy";
import Purchases from "./Components/Purchases";
import Success from "./Components/Success";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CoursesCreate from "./admin/CoursesCreate";
import UpdateCourses from "./admin/UpdateCourses";
import OurCourses from "./admin/OurCourses";

const App = () => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases/:courseId" element={user ? <Purchases /> : <Navigate to="/login" replace />}/>
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={admin ? <Dashboard /> : <Navigate to="/admin/login" replace />} />
        <Route path="/admin/create-course" element={<CoursesCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourses />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
        <Route path="/success" element={<Success />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
};

export default App;