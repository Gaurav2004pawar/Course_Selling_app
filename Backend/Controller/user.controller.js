import User from "../Model/user.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken"
import config from "../config.js";
import Purchase from "../Model/purchase.js";
import Course from "../Model/course.js";
import Order from "../Model/order.js";

// Zod Validation Schema
const userSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),

  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// SIGNUP
const signup = async (req, res) => {
  try {
    const validation = userSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.issues.map((err) => err.message),
      });
    }

    const { firstName, lastName, email, password } = validation.data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

// LOGIN
 const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    // jwt code
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_USER_PASSWORD,
      { expiresIn: "1d" }
     
    );
     
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, //  can't be accsed via js directly
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict", // CSRF attacks
    };
   
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ errors: "Error in login" });
  
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



const purchases = async (req, res) => {
  try {
    const userId = req.userId;

    const purchased = await Order.find({ userId });

    const purchasedCourseIds = purchased.map(
      (item) => item.courseId
    );

    const courseData = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    return res.status(200).json({
      success: true,
      totalCourses: courseData.length,
      courseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export { signup, login,  logout , purchases};