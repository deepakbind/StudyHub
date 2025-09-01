// const cloudinary = require("cloudinary").v2

// exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
//   const options = { folder }
//   if (height) {
//     options.height = height
//   }
//   if (quality) {
//     options.quality = quality
//   }
//   options.resource_type = "auto"
//   console.log("OPTIONS", options)
//   return await cloudinary.uploader.upload(file.tempFilePath, options)
// }


// const cloudinary = require("cloudinary").v2;

// exports.uploadImageToCloudinary = async (filePath, folder, height, quality) => {
//   const options = { folder };
//   if (height) {
//     options.height = height;
//   }
//   if (quality) {
//     options.quality = quality;
//   }
//   options.resource_type = "auto";

//   console.log("OPTIONS", options);

//   // यहाँ अब सिर्फ filePath directly use करो
//   return await cloudinary.uploader.upload(filePath, options);
// };


const cloudinary = require("cloudinary").v2;
const fs = require('fs');

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

exports.uploadFileToCloudinary = async (fileInput, folder = "studyhub_images") => {
  try {
    let filePath;
    
    // Handle both file object and file path string
    if (typeof fileInput === 'object' && fileInput.tempFilePath) {
      filePath = fileInput.tempFilePath;
    } else if (typeof fileInput === 'string') {
      filePath = fileInput;
    } else {
      throw new Error("Invalid file input. Expected file object or file path string");
    }

    if (!filePath) throw new Error("No file path provided for upload");
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist at path: ${filePath}`);
    }

    console.log("📤 Uploading file from path:", filePath);

    const uploadedFile = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "auto",
    });

    return uploadedFile; // Return full Cloudinary response
  } catch (error) {
    console.log("❌ Cloudinary upload error:", error);
    throw error;
  }
};
