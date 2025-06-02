const { AppError } = require("../utils/customErrors");
const User = require("../models/user-model");

async function validateToken(req, res, next) {
  console.log("\n⚠️  validateToken...");

  try {
    const token = req?.headers?.authorization?.slice(7);

    if (!token) {
      console.log("❌ No token provided");
      return next(
        new AppError({
          message: "No token provided",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
        })
      );
    }

    const user = await User.findOne({ token });

    if (!user) {
      console.log("❌ User not found");
      return next(
        new AppError({
          message: "Invalid token",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
        })
      );
    }

    req.user = user;

    console.log("✅ validateToken");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateToken;
