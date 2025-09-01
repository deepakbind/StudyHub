const mongoose = require("mongoose");

// Define the RatingAndReview schema
// const ratingAndReviewSchema = new mongoose.Schema({
// 	user: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		required: true,
// 		ref: "user",
// 	},
// 	rating: {
// 		type: Number,
// 		required: true,
// 	},
// 	review: {
// 		type: String,
// 		required: true,
// 	},
// 	course: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		required: true,
// 		ref: "Course",
// 		index: true,
// 	},
// });

// new version code for testing 7:41 am 1-9-25
const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});


// Export the RatingAndReview model
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
