import User from "../Model/user.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken"
import config from "../config.js";
import Purchase from "../Model/purchase.js";
import Course from "../Model/course.js";
import Admin from "../Model/admin.js";

// Zod Validation Schema
const adminSchema = z.object({
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
const signup = async (req, res) => {
  try {
    const validation = adminSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: validation.error.issues.map((err) => err.message),
      });
    }

    const { firstName, lastName, email, password } = validation.data;

    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await admin.save();

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }
const token = jwt.sign(
  { id: admin._id },
  config.JWT_ADMIN_PASSWORD,
  { expiresIn: "1d" }
);


    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: " Admin Login successful",
      admin,token,
    });
  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.cookies?.jwt) {
      return res.status(401).json({
        error: "Kindly login first",
      });
    }

    res.clearCookie("jwt");

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
export { signup, login,  logout };