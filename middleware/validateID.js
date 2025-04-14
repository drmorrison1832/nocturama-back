const mongoose = require("mongoose");

function validateID(req, res, next) {
  console.log("\n⚠️  validateID...");

  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    console.log("✅ ID validation successful");
    next();
  }

  const error = new Error("Invalid ID format");
  error.name = "CastError";
  return next(error);
}

module.exports = validateID;
