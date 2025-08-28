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

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder, resource_type: "auto" };

    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }

    console.log("OPTIONS", options);

    // ✅ यहाँ हमेशा file.tempFilePath use करना है
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
