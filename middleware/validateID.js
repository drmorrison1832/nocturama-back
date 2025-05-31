const mongoose = require("mongoose");

const { AppError } = require("../utils/customErrors");

function validateID(req, res, next) {
  console.log("\n⚠️  validateID...");

  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    console.log("✅ validateID");
    return next();
  }

  console.log("❌ Invalid ID format");
  const error = new AppError({
    message: "Invalid ID format",
    name: "CastError",
    code: 400,
    type: "INVALID_ID",
    details: {
      providedId: req.params.id,
      expectedFormat: "MongoDB ObjectId (24 characters hexadecimal)",
    },
  });

  throw error;
}

module.exports = validateID;
