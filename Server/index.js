// // Importing necessary modules and packages
// const express = require("express");
// const app = express();
// const userRoutes = require("./routes/user");
// const profileRoutes = require("./routes/profile");
// const courseRoutes = require("./routes/Course");
// const paymentRoutes = require("./routes/Payments");
// const contactUsRoute = require("./routes/Contact");
// const categoryRoutes = require("./routes/Category")

// app.use("/api/v1/auth", userRoutes)
// app.use("/api/v1/profile", profileRoutes)
// app.use("/api/v1/course", courseRoutes)
// app.use("/api/v1/payment", paymentRoutes)
// app.use("/api/v1/reach", contactUsRoute)
// app.use("/api/v1/categories", categoryRoutes)   // 🔹 नया जोड़ा

// const database = require("./config/database");
// app.use(express.json());
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const { cloudinaryConnect } = require("./config/cloudinary");
// const fileUpload = require("express-fileupload");
// const dotenv = require("dotenv");

// // Setting up port number
// const PORT = process.env.PORT || 4000;

// // Loading environment variables from .env file
// dotenv.config();
// // require("dotenv").config();
// // console.log("From index.js ->", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);

// // require("dotenv").config();  

// // Connecting to database
// database.connect();
 
// // Middlewares
// app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );
// app.use(
// 	fileUpload({
// 		useTempFiles: true,
// 		tempFileDir: "/tmp/",  // temporary storage for uploaded files
// 	})
// );

// // Connecting to cloudinary
// cloudinaryConnect();

// // Setting up routes
// app.use("/api/v1/auth", userRoutes);
// app.use("/api/v1/profile", profileRoutes);
// app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/reach", contactUsRoute);
// app.use("/api/v1/categories", categoryRoutes);   

// // Testing the server
// app.get("/", (req, res) => {
// 	return res.json({
// 		success: true,
// 		message: "Your server is up and running ...",
// 	});
// });

// // Listening to the server
// app.listen(PORT, () => {
// 	console.log(`App is listening at ${PORT}`);
// });


// // End of code.


// Importing necessary modules and packages
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");
const database = require("./config/database");
// const fileUpload = require("express-fileupload");
// const path = require("path");
// Importing routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const categoryRoutes = require("./routes/Category");

// Load environment variables
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

// Connect to database
database.connect();

// ✅ Middlewares
app.use(express.json());
// changed and check position
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

// ✅ File upload middleware (सबसे आख़िर में middlewares में)
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/", // temporary storage for uploaded files
		createParentPath: true,// new changed
		// // tempFileDir: "C:/Users/Deepak/AppData/Local/Temp/", // Windows compatible temp folder
		// // tempFileDir: path.join(__dirname, "tmp"), // Windows-friendly temp folder
		// tempFilePath: 'C:\\Users\\Deepak Kumar Bind\\OneDrive\\Desktop\\studyhub\\Server\\tmp\\tmp-2-105201755849767263'

	})
);

// ✅ Connect to cloudinary
cloudinaryConnect();

// ✅ Setting up routes (middlewares के बाद ही होने चाहिए)
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/categories", categoryRoutes);


// ✅ Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// ✅ Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
