const mongoose = require("mongoose")

// Define the Courses schema
// const coursesSchema = new mongoose.Schema({
//   courseName: { type: String },
//   courseDescription: { type: String },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "user",
//   },
//   whatYouWillLearn: {
//     type: String,
//   },
//   courseContent: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Section",
//     },
//   ],
//   ratingAndReviews: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "RatingAndReview",
//     },
//   ],
//   price: {
//     type: Number,
//   },
//   thumbnail: {
//     type: String,
//   },
//   tag: {
//     type: [String],
//     required: true,
//   },
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     // required: true,
//     ref: "Category",
//   },
//   studentsEnroled: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       // required: true,
//       // ref: "user",

//       // new change
//       ref: "User"
//     },
//   ],
//   instructions: {
//     type: [String],
//   },
//   status: {
//     type: String,
//     enum: ["Draft", "Published"],
//   },
//   createdAt: { type: Date, default: Date.now },
// })

// Export the Courses model
// module.exports = mongoose.model("Course", coursesSchema)


// Define the Courses schema
const coursesSchema = new mongoose.Schema({
  courseName: { type: String },
  courseDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",   // ✅ fixed here
  },
  whatYouWillLearn: {
    type: String,
  },
  courseContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  studentsEnroled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // ✅ fixed
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: { type: Date, default: Date.now },
})

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema)