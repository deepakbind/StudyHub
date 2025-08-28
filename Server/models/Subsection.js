// const mongoose = require("mongoose");

// const SubSectionSchema = new mongoose.Schema({
// 	title: { type: String },
// 	timeDuration: { type: String },
// 	description: { type: String },
// 	videoUrl: { type: String },
// });

// module.exports = mongoose.model("SubSection", SubSectionSchema);


const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  timeDuration: { type: String, default: "0:00" },
  description: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
