import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const UpdateCourses = () => {
const {id}=useParams()
const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading,setLoading]=useState(true)

  const navigate = useNavigate();
useEffect(()=>{
  const fetchCourseData=async()=>{
    try {
      const {data}=await axios.get(`http://localhost:3000/courseName/${id}`,{
        withCredentials:true
      })
  console.log(data)
  setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImagePreview(data.course.image.url);
      
    } catch (error) {
      console.log(error)
      toast.error("failed to fetch course data")
      setLoading(false)
    }

  }
 fetchCourseData()
},[id])

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
  const handleUpdateCourses = async (e) => {
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
   
    if(image){ formData.append("image", image);}

    try {
  const response = await axios.put(
    `http://localhost:3000/courseName/update/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );   console.log(response.data)

      toast.success( "Course Update Successfully");
      navigate("/admin/our-courses")

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
   <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 py-10 px-4">

  <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 transition-all duration-500 hover:shadow-indigo-300 hover:-translate-y-1">

    {/* Heading */}
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold text-gray-800 tracking-wide">
        Update Course
      </h2>
      <p className="text-gray-500 mt-2">
        Edit your course details and save changes.
      </p>
    </div>

    <form onSubmit={handleUpdateCourses} className="space-y-6">

      {/* Title */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">
          Course Title
        </label>

        <input
          type="text"
          placeholder="Course Title"
          className="w-full border border-gray-300 bg-white p-3 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">
          Course Description
        </label>

        <textarea
          placeholder="Course Description"
          rows="4"
          className="w-full border border-gray-300 bg-white p-3 rounded-xl outline-none resize-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">
          Course Price (₹)
        </label>

        <input
          type="number"
          placeholder="Course Price"
          className="w-full border border-gray-300 bg-white p-3 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-400"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">
          Update Course Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={changePhotoHandler}
          className="w-full border-2 border-dashed border-blue-300 rounded-xl p-3 bg-blue-50 cursor-pointer transition-all duration-300 hover:bg-blue-100 hover:border-blue-500 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:border-0 file:rounded-lg file:cursor-pointer"
          
        />
      </div>

      {/* Preview */}
      {imagePreview && (
        <div className="flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-2xl border-4 border-white shadow-xl transition-all duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl"></div>

          </div>
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        className="w-full py-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:from-green-600 hover:to-teal-700 active:scale-95"
      >
        ✏️ Update Course
      </button>

    </form>

  </div>

</div>
  )
}

export default UpdateCourses