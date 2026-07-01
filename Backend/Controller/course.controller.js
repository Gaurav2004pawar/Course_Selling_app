import Course from "../Model/course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../Model/purchase.js";
import Stripe from "stripe";
import config from "../config.js";


const stripe = new Stripe(config.STRIPE_SECRET_KEY);


// Create Course
const createCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
     

    const { title, description, price } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        error: "Course image is required",
      });
    }

    const { image } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(400).json({
        error: "Only PNG, JPG and JPEG files are allowed",
      });
    }

    const cloudResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    const savedCourse = await Course.create({
      title,
      description,
      price,
      creatorId: adminId,
      image: {
        public_id: cloudResponse.public_id,
        url: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      savedCourse,
    });
  } catch (error) {
    console.log("Create Course Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Course


const updateCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { courseId } = req.params;

    // Check authentication
    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    

    // Find course first
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

   


   

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if(!updateCourse){
       return res.status(404).json({
        success: false,
        error: " can't updated created by other admin",
      });

    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update Course Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Course
const deleteCourse = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { courseId } = req.params;


    if (!adminId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

      

    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    
    if (!course) {
      return res.status(404).json({
        error: " can't delete created by other admin unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.log("Delete Course Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};
// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log("Get Courses Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get Single Course
const courseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log("Course Detail Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Buy Course
const buyCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        error: "Course already purchased",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
success_url: `http://localhost:5173/purchases/${courseId}?success=true&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `http://localhost:5173/buy/${courseId}?canceled=true`,

      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
        
      },

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
              description: course.description || "",
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Buy Course Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  courseDetail,
  buyCourses,
};