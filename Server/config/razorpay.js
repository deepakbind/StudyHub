const Razorpay = require("razorpay");

exports.instance = new Razorpay({
	// key_id: process.env.RAZORPAY_KEY,
	// key_secret: process.env.RAZORPAY_SECRET,
	 key_id: process.env.RAZORPAY_KEY_ID,     // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});
