// Import necessary modules
// const mongoose = require("mongoose");
// const Section = require("../models/Section")
// const SubSection = require("../models/Subsection")
// // const { uploadImageToCloudinary } = require("../utils/imageUploader")
// const { uploadFileToCloudinary } = require("../utils/imageUploader");
// const updatedSection = await Section.findById(sectionId).populate("subSection");

// Create a new sub-section for a given section
// exports.createSubSection = async (req, res) => {
//   try {
//     // Extract necessary information from the request body
//     const { sectionId, title, description } = req.body
//     const video = req.files.video

//     // Check if all necessary fields are provided
//     if (!sectionId || !title || !description || !video) {
//       return res
//         .status(404)
//         .json({ success: false, message: "All Fields are Required" })
//     }
//     console.log(video)

//     // Upload the video file to Cloudinary
//     const uploadDetails = await uploadFileToCloudinary(
//       video,
//       process.env.FOLDER_NAME
//     )
//     console.log(uploadDetails)
//     // Create a new sub-section with the necessary information
//     const SubSectionDetails = await SubSection.create({
//       title: title,
//       timeDuration: `${uploadDetails.duration}`,
//       description: description,
//       videoUrl: uploadDetails.secure_url,
//     })

//     // Update the corresponding section with the newly created sub-section
//     const updatedSection = await Section.findByIdAndUpdate(
//       // { _id: sectionId },
//       sectionId,
//       { $push: { subSection: SubSectionDetails._id } },
//       { new: true }
//     ).populate("subSection")

//     // Return the updated section in the response
//     return res.status(200).json({ success: true, data: updatedSection })
//   } catch (error) {
//     // Handle any errors that may occur during the process
//     console.error("Error creating new sub-section:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }

// exports.createSubSection = async (req, res) => {
//   try {
//     let { sectionId, title, description } = req.body;

//     if (!sectionId || !title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "sectionId, title, and description are required",
//       });
//     }

//     if (!req.files || !req.files.video) {
//       return res.status(400).json({
//         success: false,
//         message: "Video file is required",
//       });
//     }

//     const videoFile = Array.isArray(req.files.video)
//       ? req.files.video[0]
//       : req.files.video;

//     const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

//     sectionId = sectionId.toString().replace(/"/g, "");
//     if (!mongoose.Types.ObjectId.isValid(sectionId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid sectionId",
//       });
//     }

//     const newSubSection = await SubSection.create({
//       section: sectionId,
//       title,
//       description,
//       videoUrl: uploadedVideo.secure_url,
//       timeDuration: uploadedVideo.duration || "",
//     });

//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $push: { subSection: newSubSection._id } },
//       { new: true }
//     ).populate("subSection");

//     return res.status(201).json({
//       success: true,
//       message: "SubSection created successfully",
//       data: updatedSection,
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


// checking 
// exports.createSubSection = async (req, res) => {
//   try {
//     let { sectionId, title, description } = req.body;

//     // validation
//     if (!sectionId || !title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "sectionId, title, and description are required",
//       });
//     }

//     // video check
//     if (!req.files || !req.files.video) {
//       return res.status(400).json({
//         success: false,
//         message: "Video file is required",
//       });
//     }

//     const videoFile = Array.isArray(req.files.video)
//       ? req.files.video[0]
//       : req.files.video;

//     // cloudinary upload
//     const uploadedVideo = await uploadFileToCloudinary(
//       videoFile,
//       "studyhub_videos"
//     );

//     // subsection create
//     const newSubSection = await SubSection.create({
//       title,
//       description,
//       timeDuration: uploadedVideo.duration || "0:00",
//       videoUrl: uploadedVideo.secure_url,
//     });
//     console.log("✅ New SubSection created:", newSubSection);
//     // section update
//    const updated =  await Section.findByIdAndUpdate(
//       sectionId,
//       { $push: { subSection: newSubSection._id } },
//       { new: true }
//     );
//   console.log("✅ Section after update:", updated);

//     // fresh fetch with populate
//     const updatedSection = await Section.findById(sectionId).populate("subSection");
//  console.log("✅ Populated Section:", updatedSection);
//     return res.status(201).json({
//       success: true,
//       message: "SubSection created successfully",
//       data: updatedSection,
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


// exports.updateSubSection = async (req, res) => {
//   try {
//     const { sectionId, subSectionId, title, description } = req.body
//     const subSection = await SubSection.findById(subSectionId)

//     if (!subSection) {
//       return res.status(404).json({
//         success: false,
//         message: "SubSection not found",
//       })
//     }

//     if (title !== undefined) {
//       subSection.title = title
//     }

//     if (description !== undefined) {
//       subSection.description = description
//     }
//     if (req.files && req.files.video !== undefined) {
//       const video = req.files.video
//       const uploadDetails = await uploadFileToCloudinary(
//         video,
//         process.env.FOLDER_NAME
//       )
//       subSection.videoUrl = uploadDetails.secure_url
//       subSection.timeDuration = `${uploadDetails.duration}`
//     }

//     await subSection.save()

//     // find updated section and return it
//     const updatedSection = await Section.findById(sectionId).populate(
//       "subSection"
//     )

//     console.log("updated section", updatedSection)

//     return res.json({
//       success: true,
//       message: "Section updated successfully",
//       data: updatedSection,
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the section",
//     })
//   }
// }

// exports.deleteSubSection = async (req, res) => {
//   try {
//     const { subSectionId, sectionId } = req.body
//     await Section.findByIdAndUpdate(
//       { _id: sectionId },
//       {
//         $pull: {
//           subSection: subSectionId,
//         },
//       }
//     )
//     const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

//     if (!subSection) {
//       return res
//         .status(404)
//         .json({ success: false, message: "SubSection not found" })
//     }

//     // find updated section and return it
//     const updatedSection = await Section.findById(sectionId).populate(
//       "subSection"
//     )

//     return res.json({
//       success: true,
//       message: "SubSection deleted successfully",
//       data: updatedSection,
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the SubSection",
//     })
//   }
// }

// checking end

// Create a new SubSection
// exports.createSubSection = async (req, res) => {
//   try {
//     let { sectionId, title, description } = req.body;

//     // Validate required fields
//     if (!sectionId || !title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "sectionId, title, and description are required",
//       });
//     }

//     // Validate sectionId
//     sectionId = sectionId.toString().replace(/"/g, "");
//     if (!mongoose.Types.ObjectId.isValid(sectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid sectionId" });
//     }

//     // Validate video file
//     if (!req.files || !req.files.video) {
//       return res.status(400).json({ success: false, message: "Video file is required" });
//     }

//     const videoFile = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video;

//     // Upload video to Cloudinary
//     const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

//     // Create SubSection
//     const newSubSection = await SubSection.create({
//       title,
//       description,
//       timeDuration: uploadedVideo.duration || "0:00",
//       videoUrl: uploadedVideo.secure_url,
//     });

//     // Update Section with new subSection
//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $push: { subSection: newSubSection._id } },
//       { new: true }
//     ).populate("subSection");

//     if (!updatedSection) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not found",
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "SubSection created successfully",
//       data: updatedSection,
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

// Update an existing SubSection
// exports.updateSubSection = async (req, res) => {
//   try {
//     const { sectionId, subSectionId, title, description } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid sectionId" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid subSectionId" });
//     }

//     const subSection = await SubSection.findById(subSectionId);
//     if (!subSection) {
//       return res.status(404).json({ success: false, message: "SubSection not found" });
//     }

//     // Update fields
//     if (title !== undefined) subSection.title = title;
//     if (description !== undefined) subSection.description = description;

//     // Update video if provided
//     if (req.files && req.files.video !== undefined) {
//       const videoFile = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video;
//       const uploadDetails = await uploadFileToCloudinary(videoFile, "studyhub_videos");
//       subSection.videoUrl = uploadDetails.secure_url;
//       subSection.timeDuration = uploadDetails.duration || subSection.timeDuration;
//     }

//     await subSection.save();

//     // Return updated Section
//     const updatedSection = await Section.findById(sectionId).populate("subSection");
//     if (!updatedSection) {
//       return res.status(404).json({
//         success: false,
//         message: "Parent Section not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "SubSection updated successfully",
//       data: updatedSection,
//     });
//   } catch (error) {
//     console.error("Error updating sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update sub-section",
//       error: error.message,
//     });
//   }
// };

// Delete a SubSection
// exports.deleteSubSection = async (req, res) => {
//   try {
//     const { subSectionId, sectionId } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid sectionId" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
//       return res.status(400).json({ success: false, message: "Invalid subSectionId" });
//     }

//     // Remove subSection from Section
//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       { $pull: { subSection: subSectionId } },
//       { new: true }
//     ).populate("subSection");

//     if (!updatedSection) {
//       return res.status(404).json({
//         success: false,
//         message: "Section not found",
//       });
//     }

//     // Delete SubSection
//     const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
//     if (!deletedSubSection) {
//       return res.status(404).json({
//         success: false,
//         message: "SubSection not found",
//       });
//     }

//     return res.json({
//       success: true,
//       message: "SubSection deleted successfully",
//       data: updatedSection,
//     });
//   } catch (error) {
//     console.error("Error deleting sub-section:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete sub-section",
//       error: error.message,
//     });
//   }
// };

// const mongoose = require("mongoose");
// const SubSection = require("../models/Subsection");
// const Section = require("../models/Section");
// const { uploadFileToCloudinary } = require("../utils/imageUploader");



const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadFileToCloudinary } = require("../utils/imageUploader");

// CREATE SubSection
exports.createSubSection = async (req, res) => {
  try {
    let { sectionId, title, description } = req.body;

    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "sectionId, title, and description are required",
      });
    }

    sectionId = sectionId.toString().replace(/"/g, "");
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid sectionId" });
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({ success: false, message: "Video file is required" });
    }

    const videoFile = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video;
    const uploadedVideo = await uploadFileToCloudinary(videoFile, "studyhub_videos");

    const newSubSection = await SubSection.create({
      title,
      description,
      timeDuration: uploadedVideo.duration || "0:00",
      videoUrl: uploadedVideo.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sub-section",
      error: error.message,
    });
  }
};

// UPDATE SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid sectionId" });
    }

    if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
      return res.status(400).json({ success: false, message: "Invalid subSectionId" });
    }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    if (req.files && req.files.video) {
      const videoFile = Array.isArray(req.files.video) ? req.files.video[0] : req.files.video;
      const uploadDetails = await uploadFileToCloudinary(videoFile, "studyhub_videos");
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = uploadDetails.duration || subSection.timeDuration;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");
    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Parent Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error updating sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sub-section",
      error: error.message,
    });
  }
};

// DELETE SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ success: false, message: "Invalid sectionId" });
    }

    if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
      return res.status(400).json({ success: false, message: "Invalid subSectionId" });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    ).populate("subSection");

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error deleting sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete sub-section",
      error: error.message,
    });
  }
};



