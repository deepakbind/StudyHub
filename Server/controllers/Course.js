const mongoose = require("mongoose");
const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const { cloudinary } = require("../config/cloudinary");
const path = require("path");
const User = require("../models/User")

// const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { uploadFileToCloudinary } = require("../utils/imageUploader");

const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

// Function to create a new course
// exports.createCourse = async (req, res) => {
//   try {
//     // Get user ID from request object
//     const userId = req.user.id

//     // Get all required fields from request body
//     let {
//       courseName,
//       courseDescription,
//       whatYouWillLearn,
//       price,
//       tag: _tag,
//       category,
//       status,
//       instructions: _instructions,
//     } = req.body
//     // Get thumbnail image from request files
//     const thumbnail = req.files?.thumbnailImage

//     // Convert the tag and instructions from stringified Array to Array
//     const tag = JSON.parse(_tag)
//     const instructions = JSON.parse(_instructions)

//     console.log("tag", tag)
//     console.log("instructions", instructions)

//     // Check if any of the required fields are missing
//     if (
//       !courseName ||
//       !courseDescription ||
//       !whatYouWillLearn ||
//       !price ||
//       !tag.length ||
//       !thumbnail ||
//       !category ||
//       !instructions.length
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All Fields are Mandatory",
//       })
//     }
//     if (!status || status === undefined) {
//       status = "Draft"
//     }
//     // Check if the user is an instructor
//     const instructorDetails = await User.findById(userId, {
//       accountType: "Instructor",
//     })

//     if (!instructorDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Instructor Details Not Found",
//       })
//     }

//     // Check if the tag given is valid
//     const categoryDetails = await Category.findById(category)
//     if (!categoryDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "Category Details Not Found",
//       })
//     }
//     // Upload the Thumbnail to Cloudinary
//     const thumbnailImage = await uploadImageToCloudinary(
//       thumbnail,
//       process.env.FOLDER_NAME
//     )
//     console.log(thumbnailImage)
//     // Create a new course with the given details
//     const newCourse = await Course.create({
//       courseName,
//       courseDescription,
//       instructor: instructorDetails._id,
//       whatYouWillLearn: whatYouWillLearn,
//       price,
//       tag,
//       category: categoryDetails._id,
//       thumbnail: thumbnailImage.secure_url,
//       status: status,
//       instructions,
//     })

//     // Add the new course to the User Schema of the Instructor
//     await User.findByIdAndUpdate(
//       {
//         _id: instructorDetails._id,
//       },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     )
//     // Add the new course to the Categories
//     const categoryDetails2 = await Category.findByIdAndUpdate(
//       { _id: category },
//       {
//         $push: {
//           courses: newCourse._id,
//         },
//       },
//       { new: true }
//     )
//     console.log("HEREEEEEEEE", categoryDetails2)
//     // Return the new course and a success message
//     res.status(200).json({
//       success: true,
//       data: newCourse,
//       message: "Course Created Successfully",
//     })
//   } catch (error) {
//     // Handle any errors that occur during the creation of the course
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to create course",
//       error: error.message,
//     })
//   }
// }
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.id;

    // Destructure request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // Get thumbnail from files
    const thumbnail = req.files?.thumbnailImage;
    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Parse tags and instructions safely
    let tag = [];
    let instructions = [];
    try {
      tag = JSON.parse(_tag);
      instructions = JSON.parse(_instructions);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Tags and Instructions must be valid JSON arrays",
      });
    }

    // Check mandatory fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    // Default status
    if (!status) status = "Draft";

    // Check if user is instructor
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    // Check if category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ✅ Upload thumbnail to Cloudinary (pass path, not object)
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail.tempFilePath,   // 👈 सिर्फ path भेजना है
      process.env.FOLDER_NAME || "studyhub_images"
    );

    // Create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    });

    // Add course to instructor and category
    await User.findByIdAndUpdate(userId, {
      $push: { courses: newCourse._id },
    });

    await Category.findByIdAndUpdate(category, {
      $push: { courses: newCourse._id },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// here are subsection code of course
// exports.createSubSection = async (req, res) => {
//   try {
//     const { sectionId, title, description } = req.body;

//     // Validate fields
//     if (!sectionId || !title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "sectionId, title, and description are required",
//       });
//     }

//     // Check video file
//     if (!req.files || !req.files.video) {
//       return res.status(400).json({
//         success: false,
//         message: "Video file is required",
//       });
//     }

//     // Handle single/multiple files
//     const videoFile = Array.isArray(req.files.video)
//       ? req.files.video[0]
//       : req.files.video;

//     // ✅ Upload video to Cloudinary
//     const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

//     // ✅ Save to DB
//     const newSubSection = await SubSection.create({
//       // section: sectionId,
//       //  section: sectionId.toString(), // ensure it's a string
//       // title,
//       // description,
//       // video: uploadedVideo.secure_url,
//   section: typeof sectionId === "string" ? sectionId : sectionId._id,
//   title,
//   description,
//   video: uploadedVideo.secure_url,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "SubSection created successfully",
//       data: newSubSection,
//     });
//   } catch (error) {
//     console.error("Error creating sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create sub-section",
//       error: error.message,
//     });
//   }
// };

// exports.createSubSection = async (req, res) => {
//   try {
//     const { sectionId, title, description } = req.body;

//     // Validate required fields
//     if (!sectionId || !title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "sectionId, title, and description are required",
//       });
//     }

//     // Validate video file
//     if (!req.files || !req.files.video) {
//       return res.status(400).json({
//         success: false,
//         message: "Video file is required",
//       });
//     }

//     // Handle single/multiple files
//     const videoFile = Array.isArray(req.files.video)
//       ? req.files.video[0]
//       : req.files.video;

//     // Upload video to Cloudinary
//     const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

//     // Ensure sectionId is always a string without extra quotes
// const cleanSectionId = 
//     typeof sectionId === "string" 
//         ? sectionId.replace(/"/g, "") // remove extra quotes
//         : sectionId.sectionId          // handle object like { sectionId: '...' }
//         ? sectionId.sectionId.replace(/"/g, "")
//         : sectionId._id.toString();

//     // Create new SubSection
//     const newSubSection = await SubSection.create({
//       section: cleanSectionId,
//       title,
//       description,
//       video: uploadedVideo.secure_url,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "SubSection created successfully",
//       data: newSubSection,
//     });
//   } catch (error) {
//     console.error("Error creating sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create sub-section",
//       error: error.message,
//     });
//   }
// };

exports.createSubSection = async (req, res) => {
  try {

    let { sectionId, title, description } = req.body;

    // Validate required fields
    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "sectionId, title, and description are required",
      });
    }

    // Validate video file
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    // Handle single/multiple files
    const videoFile = Array.isArray(req.files.video)
      ? req.files.video[0]
      : req.files.video;

    // Upload video to Cloudinary
    const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

    // -------------------------------
    // Clean and validate sectionId
    // -------------------------------
    if (typeof sectionId === "object" && sectionId.sectionId) {
      sectionId = sectionId.sectionId;
    }

    sectionId = sectionId.toString().replace(/"/g, "");

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sectionId",
      });
    }

    // Create new SubSection
    const newSubSection = await SubSection.create({
      section: sectionId,
      title,
      description,
      video: uploadedVideo.secure_url,
    });
  // console.log("sectionId received:", sectionId);
    // Update Section by adding subSection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

// console.log("updatedSection after update:", updatedSection);
   if (!updatedSection) {
    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  }

  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sub-section",
      error: error.message,
    });
  }
};


// Edit Course Details
// exports.editCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const updates = req.body
//     const course = await Course.findById(courseId)

//     if (!course) {
//       return res.status(404).json({ error: "Course not found" })
//     }

//     // If Thumbnail Image is found, update it
//     if (req.files) {
//       console.log("thumbnail update")
//       const thumbnail = req.files.thumbnailImage
//       const thumbnailImage = await uploadImageToCloudinary(
//         thumbnail,
//         process.env.FOLDER_NAME
//       )
//       course.thumbnail = thumbnailImage.secure_url
//     }

//     // Update only the fields that are present in the request body
//     for (const key in updates) {
//       if (updates.hasOwnProperty(key)) {
//         if (key === "tag" || key === "instructions") {
//           course[key] = JSON.parse(updates[key])
//         } else {
//           course[key] = updates[key]
//         }
//       }
//     }

//     await course.save()

//     const updatedCourse = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()

//     res.json({
//       success: true,
//       message: "Course updated successfully",
//       data: updatedCourse,
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }


exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // ✅ If Thumbnail Image is found, update it
    if (req.files && req.files.thumbnailImage) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadFileToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME || "studyhub_images"
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // ✅ Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();
// id:courseId but now only courseId {id:courseId} at first
    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

// { _id: courseId,}
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
//{ _id: courseId,}
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const { courseId } = req.body

//     // Find the course
//     const course = await Course.findById(courseId)
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" })
//     }

//     // Unenroll students from the course
//     // const studentsEnrolled = course.studentsEnroled
//     // for (const studentId of studentsEnrolled) {
//     //   await User.findByIdAndUpdate(studentId, {
//     //     $pull: { courses: courseId },
//     //   })
//     // }
//     const studentsEnrolled = course.studentsEnrolled; // make sure spelling matches schema
// if (studentsEnrolled && studentsEnrolled.length) {
//   for (const studentId of studentsEnrolled) {
//     await User.findByIdAndUpdate(studentId, {
//       $pull: { courses: courseId },
//     });
//   }
// }


//     // Delete sections and sub-sections
//     const courseSections = course.courseContent
//     for (const sectionId of courseSections) {
//       // Delete sub-sections of the section
//       const section = await Section.findById(sectionId)
//       if (section) {
//         const subSections = section.subSection
//         for (const subSectionId of subSections) {
//           await SubSection.findByIdAndDelete(subSectionId)
//         }
//       }

//       // Delete the section
//       await Section.findByIdAndDelete(sectionId)
//     }

//     // Delete the course
//     await Course.findByIdAndDelete(courseId)

//     return res.status(200).json({
//       success: true,
//       message: "Course deleted successfully",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     })
//   }
// }

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled || []; // safe check
    if (studentsEnrolled.length) {
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        });
      }
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent || []; // safe check
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection || [];
        if (subSections.length) {
          await SubSection.deleteMany({ _id: { $in: subSections } }); // bulk delete
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course itself
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

