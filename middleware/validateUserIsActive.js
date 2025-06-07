const { AppError } = require("../utils/customErrors");
const User = require("../models/user-model");

async function validateUserIsActive(req, res, next) {
  console.log("\n⚠️  validateUserIsActive...");

  try {
    if (!req.user.active) {
      console.log("❌ User account not active");
      return next(
        new AppError({
          message: "Account is not active",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
          details: null,
        })
      );
    }

    console.log("✅ validateUserIsActive");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateUserIsActive;
