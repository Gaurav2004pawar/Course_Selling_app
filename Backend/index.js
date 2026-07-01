import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import userRouter from './Route/user.route.js'
import adminRouter from "./Route/admin.route.js";
import cookieParser from 'cookie-parser'
import cors from "cors"

import courseRoutes from "./Route/route.course.js";

dotenv.config();

const app = express();
app.use(cookieParser());

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// cloudinary config
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// routes
app.use("/courseName", courseRoutes);
app.use("/user", userRouter);
app.use("/user/admin", adminRouter);

// DB connection
const dbconnect= async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connect to mongodb")
        
    } catch (error) {
        console.log(error)
        
    }
}
dbconnect();

// server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});