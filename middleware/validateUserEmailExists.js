const { AppError } = require("../utils/customErrors");
const sanitizeEmail = require("../utils/sanitizeEmail");
const User = require("../models/user-model");

async function validateUserEmailExists(req, res, next) {
  console.log("\n⚠️  validateUserExists...");

  try {
    const email = sanitizeEmail(req.body.email);

    const exists = await User.exists({ email: email });

    if (!exists) {
      console.log("❌ User not found");
      return next(
        new AppError({
          message: "Wrong email or password",
          name: "unauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
          details: null,
        })
      );
    }
    console.log("✅ validateUserExists");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateUserEmailExists;
