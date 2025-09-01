const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
// const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { uploadFileToCloudinary } = require("../utils/imageUploader");

const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// exports.updateDisplayPicture = async (req, res) => {
//   try {
//     console.log("req.files:", req.files);
//     console.log("FOLDER_NAME:", process.env.FOLDER_NAME);

//     const displayPicture = req.files.displayPicture
//     console.log("displayPicture:", displayPicture);
//     console.log("")
//     const userId = req.user.id
//     const image = await uploadImageToCloudinary(
//       displayPicture,
//       process.env.FOLDER_NAME,
//       1000,
//       1000
//     )
//     console.log(image)
//     const updatedProfile = await User.findByIdAndUpdate(
//       { _id: userId },
//       { image: image.secure_url },
//       { new: true }
//     )
//     res.send({
//       success: true,
//       message: `Image Updated successfully`,
//       data: updatedProfile,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

exports.updateDisplayPicture = async (req, res) => {
  try {
    console.log("req.files:", req.files);
    console.log("FOLDER_NAME:", process.env.FOLDER_NAME);

    const displayPicture = req.files?.displayPicture;
    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const userId = req.user.id;

    // Upload image to Cloudinary
    const image = await uploadFileToCloudinary(
      displayPicture.tempFilePath, // Must pass tempFilePath
      process.env.FOLDER_NAME,
      1000, // height (optional)
      100   // quality must be <= 100
    );

    console.log("Cloudinary result:", image);

    // Update user profile with new image URL
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    res.json({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("Error updating display picture:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// old code is better but 
// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.user.id
//     console.log("User ID:", userId); // ✅ Check user id
//     let userDetails = await User.findOne({
//       _id: userId,
//     })
//       .populate({
//         path: "courses",
//         populate: {
//           path: "courseContent",
//           populate: {
//             path: "subSection",
//           },
//         },
//       })
//       .exec()
//       userDetails = userDetails.toObject()
//       console.log("User Details Fetched:", userDetails); // ✅ Check fetched user
//     var SubsectionLength = 0
//     for (var i = 0; i < userDetails.courses.length; i++) {
//       let totalDurationInSeconds = 0
//       SubsectionLength = 0
//       for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
//         totalDurationInSeconds += userDetails.courses[i].courseContent[
//           j
//         ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
//         userDetails.courses[i].totalDuration = convertSecondsToDuration(
//           totalDurationInSeconds
//         )
//         SubsectionLength +=
//           userDetails.courses[i].courseContent[j].subSection.length
//       }
//       let courseProgressCount = await CourseProgress.findOne({
//         courseID: userDetails.courses[i]._id,
//         userId: userId,
//       })
//       courseProgressCount = courseProgressCount?.completedVideos.length
//       if (SubsectionLength === 0) {
//         userDetails.courses[i].progressPercentage = 100
//       } else {
//         // To make it up to 2 decimal point
//         const multiplier = Math.pow(10, 2)
//         userDetails.courses[i].progressPercentage =
//           Math.round(
//             (courseProgressCount / SubsectionLength) * 100 * multiplier
//           ) / multiplier
//       }
//     }

//     if (!userDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find user with id: ${userDetails}`,
//       })
//     }
//      console.log("Courses Array:", userDetails.courses); // ✅ Check courses array
//     return res.status(200).json({
//       success: true,
//       data: userDetails.courses,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
// testing code
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching courses for user:", userId);

    // 1. पहले User से populate करके ट्राय करो
    let user = await User.findById(userId)
      .populate({
        path: "courses",
        populate: [
          { path: "instructor", select: "firstName lastName email" },
          { path: "category", select: "name" }
        ]
      })
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let enrolledCourses = user.courses;

    // 2. अगर User.courses[] empty है तो Course.studentsEnroled से check करो
    if (!enrolledCourses || enrolledCourses.length === 0) {
      console.log("User.courses empty → fallback to Course collection");

      enrolledCourses = await Course.find({ studentsEnroled: userId })
        .populate("instructor", "firstName lastName email")
        .populate("category", "name")
        .exec();
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: enrolledCourses,
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
};





exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}


// new add today 8:40am student enrolled
// exports.enrollStudent = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const studentId = req.user.id;

//     // Course check karo
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     // Student already enrolled check karo
//     if (!course.studentsEnroled.includes(studentId)) {
//       course.studentsEnroled.push(studentId);
//       await course.save();
//       return res.status(200).json({ success: true, message: "Student enrolled successfully!" });
//     } else {
//       return res.status(200).json({ success: true, message: "Student already enrolled" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.enrollStudent = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const studentId = req.user.id;

//     // Course check karo
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     // Student already enrolled check karo
//     if (!course.studentsEnroled.includes(studentId)) {
//       course.studentsEnroled.push(studentId);
//       await course.save();

//       // ✅ User document bhi update karo
//       const user = await User.findById(studentId);
//       if (!user.courses.includes(courseId)) {
//         user.courses.push(courseId);
//         await user.save();
//       }

//       return res.status(200).json({ success: true, message: "Student enrolled successfully!" });
//     } else {
//       return res.status(200).json({ success: true, message: "Student already enrolled" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// Enroll course function
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log("Enroll Request => userId:", userId, "courseId:", courseId);

    const user = await User.findById(userId);
    console.log("User Courses Before:", user.courses);

    const isAlreadyEnrolled = user.courses.some(
      course => course.toString() === courseId.toString()
    );

    if (isAlreadyEnrolled) {
      console.log("User already enrolled in this course");
      return res.status(200).json({
        success: true,
        message: "Student already enrolled"
      });
    }

    // Add course to student
    user.courses.push(courseId);
    await user.save();
    console.log("User Courses After:", user.courses);

    // Add student to course
    const course = await Course.findById(courseId);
    console.log("Course Students Before:", course.studentsEnroled);

    course.studentsEnroled.push(userId);
    await course.save();
    console.log("Course Students After:", course.studentsEnroled);

    return res.status(200).json({
      success: true,
      message: "Course enrolled successfully"
    });

  } catch (error) {
    console.error("Enroll Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to enroll course",
      error: error.message,
    });
  }
};




exports.enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const student = await User.findById(studentId);

    // Student already enrolled check
    if (!course.studentsEnroled.includes(studentId)) {
      course.studentsEnroled.push(studentId);
      student.courses.push(courseId);   // ✅ ये missing था
      await course.save();
      await student.save();
      return res.status(200).json({ success: true, message: "Student enrolled successfully!" });
    } else {
      return res.status(200).json({ success: true, message: "Student already enrolled" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


