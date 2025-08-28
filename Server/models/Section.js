const mongoose = require("mongoose");

// Define the Section schema
const sectionSchema = new mongoose.Schema({
	sectionName: {
		type: String,
		require: true
	},
	subSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "SubSection",
			// required: true,
		},
	],
});

// Export the Section model
module.exports = mongoose.model("Section", sectionSchema);
