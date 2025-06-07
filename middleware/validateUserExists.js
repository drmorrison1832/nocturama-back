const { AppError } = require("../utils/customErrors");
const sanitizeEmail = require("../utils/sanitizeEmail");
const User = require("../models/user-model");

async function validateUserExists(req, res, next) {
  console.log("\n⚠️  validateUserExists...");

  try {
    const email = sanitizeEmail(req.body.email);

    const user = await User.findOne({ email: email });

    if (!user) {
      console.log("❌ User not found");
      return next(
        new AppError({
          message: "Wrong email or password",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
          details: null,
        })
      );
    }

    console.log(user);

    req.user = user;

    console.log("✅ validateUserExists");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateUserExists;
