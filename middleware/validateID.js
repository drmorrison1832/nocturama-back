const mongoose = require("mongoose");

function validateID(req, res, next) {
  console.log("\n⚠️  validateID...");

  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    console.log("✅ ID validation successful");
    next();
  }

  console.log("❌ Invalid ID format");

  const err = new Error("Invalid ID format");
  err.name = "CastError";
  err.statusCode = 400;

  console.log("❌❌❌❌❌ err.statusCode is", err.statusCode);

  err.status = "error";
  err.type = "INVALID_ID";
  err.message = "Invalid ID format";
  err.details = req?.params?.id || null;

  next(err);
}

module.exports = validateID;
