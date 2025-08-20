require("dotenv").config(); // pehli line
const Razorpay = require("razorpay");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

exports.instance = new Razorpay({
	// key_id: process.env.RAZORPAY_KEY,
	// key_secret: process.env.RAZORPAY_SECRET,
	 key_id: process.env.RAZORPAY_KEY_ID,     // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});
