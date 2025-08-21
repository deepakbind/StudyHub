// const cloudinary = require("cloudinary").v2; //! Cloudinary is being required
// require("dotenv").config(); // make sure env is loaded
// exports.cloudinaryConnect = () => {
// 	try {
// 		cloudinary.config({
// 			/!    ########   Configuring the Cloudinary to Upload MEDIA ########
// 			cloud_name: process.env.CLOUD_NAME,
// 			api_key: process.env.API_KEY,
// 			api_secret: process.env.API_SECRET,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 	}
// };


const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUD_API_KEY,     // ✅ सही
			api_secret: process.env.CLOUD_API_SECRET, // ✅ सही
		});
		console.log("Cloudinary connected successfully");
	} catch (error) {
		console.log("Cloudinary connection error:", error);
	}
};
