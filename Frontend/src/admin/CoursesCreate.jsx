import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/utils";

const CoursesCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  // Image Preview
  const changePhotoHandler = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Create Course
  const handleCreateCourses = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("admin");

    if (!token) {
      toast.error("Please login first");
      navigate("/admin/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${BACKEND_URL }/courseName/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course Created Successfully");

      // Clear Form
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview("");

      navigate("/admin/our-courses");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to create course"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 py-10 px-4">

  <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 p-8 transition-all duration-500 hover:shadow-blue-300">

    {/* Heading */}
    <div className="text-center mb-8">
      <h2 className="text-4xl font-extrabold text-gray-800">
        Create Course
      </h2>
      <p className="text-gray-500 mt-2">
        Add a new course to your learning platform
      </p>
    </div>

    <form onSubmit={handleCreateCourses} className="space-y-6">

      {/* Course Title */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Course Title
        </label>
        <input
          type="text"
          placeholder="Enter Course Title"
          className="w-full border border-gray-300 rounded-xl p-3 bg-white outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Course Description
        </label>

        <textarea
          placeholder="Write course description..."
          rows="5"
          className="w-full border border-gray-300 rounded-xl p-3 bg-white outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Course Price (₹)
        </label>

        <input
          type="number"
          placeholder="Enter Price"
          className="w-full border border-gray-300 rounded-xl p-3 bg-white outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      {/* Upload */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Upload Course Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={changePhotoHandler}
          className="w-full border border-dashed border-blue-400 rounded-xl p-3 bg-blue-50 cursor-pointer file:bg-blue-600 file:text-white file:px-4 file:py-2 file:border-0 file:rounded-lg file:cursor-pointer hover:bg-blue-100 transition-all duration-300"
          required
        />
      </div>

      {/* Preview */}
      {imagePreview && (
        <div className="flex justify-center">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 rounded-2xl object-cover shadow-xl border-4 border-white transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
            />

            <div className="absolute inset-0 rounded-2xl bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </div>
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
      >
        🚀 Create Course
      </button>

    </form>

  </div>

</div>
  );
};

export default CoursesCreate;