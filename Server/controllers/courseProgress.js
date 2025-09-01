const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")


// old code 
// exports.updateCourseProgress = async (req, res) => {
//   const { courseId, subsectionId } = req.body
//   const userId = req.user.id

//   try {
//     // Check if the subsection is valid
//     const subsection = await SubSection.findById(subsectionId)
//     if (!subsection) {
//       return res.status(404).json({ error: "Invalid subsection" })
//     }

//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })

//     if (!courseProgress) {
//       // If course progress doesn't exist, create a new one
//       return res.status(404).json({
//         success: false,
//         message: "Course progress Does Not Exist",
//       })
//     } else {
//       // If course progress exists, check if the subsection is already completed
//       if (courseProgress.completedVideos.includes(subsectionId)) {
//         return res.status(400).json({ error: "Subsection already completed" })
//       }

//       // Push the subsection into the completedVideos array
//       courseProgress.completedVideos.push(subsectionId)
//     }

//     // Save the updated course progress
//     await courseProgress.save()

//     return res.status(200).json({ message: "Course progress updated" })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }


// testing code 5:35 pm 31 (testing working better before code)
exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.id;

  try {
    // 1️⃣ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(subSectionId)) {
      return res.status(400).json({ success: false, message: "Invalid courseId or subSectionId" });
    }

    // 2️⃣ Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 3️⃣ Check if user is enrolled
    if (!course.studentsEnroled.includes(userId)) {
      return res.status(403).json({ success: false, message: "User not enrolled in this course" });
    }

    // 4️⃣ Check if subsection exists in DB
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "Invalid subsection" });
    }

    // 5️⃣ Find or create course progress for user
    let courseProgress = await CourseProgress.findOne({ courseID: courseId, userId });

    if (!courseProgress) {
      // Create new if doesn't exist
      courseProgress = new CourseProgress({
        courseID: courseId,
        userId,
        completedVideos: [subSectionId],
      });
    } else {
      // Check if already completed
      if (courseProgress.completedVideos.includes(subSectionId)) {
        return res.status(400).json({ success: false, message: "Subsection already completed" });
      }
      courseProgress.completedVideos.push(subSectionId);
    }

    await courseProgress.save();

    return res.status(200).json({ success: true, message: "Course progress updated successfully" });

  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// percentage checking
exports.getProgressPercentage = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id

    // Course details laao with sections and subsections
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const totalLectures = course.courseContent.reduce(
      (acc, section) => acc + section.subSection.length,
      0
    )

    const courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId,
    })

    const completedLectures = courseProgress?.completedVideos?.length || 0

    const percentage =
      totalLectures === 0
        ? 0
        : Math.round((completedLectures / totalLectures) * 100)

    return res.status(200).json({
      success: true,
      totalLectures,
      completedLectures,
      percentage,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}