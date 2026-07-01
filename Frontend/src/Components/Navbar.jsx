import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
   <>
    {/* Navbar */}
    <div className=' bg-gradient-to-r from-black via-blue-950 to-blue-900 text-white'>
      <nav className="flex justify-between items-center px-10 py-5">
        <h1 className="text-3xl font-bold text-orange-500">
          CourseHaven
        </h1>

        <div className="space-x-4">
          <Link
            to="/admin/login"
            className="border border-white px-5 py-2 rounded hover:bg-white hover:text-black"
          >
            Login
          </Link>

          <Link
            to="/admin/signup"
            className="border border-white px-5 py-2 rounded hover:bg-white hover:text-black"
          >
            Signup
          </Link>
        </div>
      </nav>
      </div>
   
   </>
  )
}
