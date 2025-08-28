// const mongoose = require("mongoose");

// const parseObjectId = (id) => {
//   if (!id) throw new Error("ID is required");
//   const cleanId = id.toString().replace(/"/g, "");
//   if (!mongoose.Types.ObjectId.isValid(cleanId)) throw new Error("Invalid ObjectId");
//   return cleanId;
// };

// module.exports = { parseObjectId };


const mongoose = require("mongoose");

function parseObjectId(id) {
  if (!id) return null;

  // Remove extra quotes
  let cleanId = id.toString().replace(/^"+|"+$/g, "");

  // Validate ObjectId
  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    return mongoose.Types.ObjectId(cleanId);
  } else {
    return null;
  }
}

module.exports = parseObjectId;
