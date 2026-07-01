import express from "express"
import { buyCourses, courseDetail,  createCourse,  deleteCourse,  getAllCourses,    updateCourse } from "../Controller/course.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";
import verifyPayment from "../Controller/order.controller.js";



const router=express.Router();
router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/course",getAllCourses)
router.get("/:courseId",courseDetail)
router.post("/buy/:courseId",userMiddleware,buyCourses)
router.post("/verify-payment", userMiddleware, verifyPayment);



export default router