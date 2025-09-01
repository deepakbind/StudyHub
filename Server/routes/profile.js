const express = require("express")
const router = express.Router()
//  new change isStuent 8:18am
const { enrollStudent } = require("../controllers/profile");
const { auth, isInstructor, isStudent } = require("../middleware/auth")
const { getProgressPercentage } = require("../controllers/courseProgress");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  enrollCourse,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/profile")
//this line also
const { updateCourseProgress } = require("../controllers/courseProgress");
// Add this line for progress percentage
router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage);
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// Add this route under the Profile routes section this line also toady add 8:41
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
// Student enroll route
router.post("/enrollStudent", auth, isStudent, enrollStudent);
// Enroll a student in a course
router.post("/enrollCourse", auth, enrollStudent);
// ✅ Enroll course route
router.post('/enrollCourse', auth, enrollCourse);

//today end
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router
