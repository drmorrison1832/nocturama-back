const { AppError } = require("../utils/customErrors");
const User = require("../models/user-model");

async function validateToken(req, res, next) {
  console.log("\n⚠️  validateToken...");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

    const token = authHeader.split(" ")[1];
    const user = await User.findOne({ token });

    if (!user) {
      console.log("❌ User not found");
      return next(
        new AppError({
          message: "User not recognized",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
        })
      );
    }

    if (new Date(Date.now()) > user.tokenExpiresAt) {
      console.log("❌ Token expired");
      return next(
        new AppError({
          message: "Token expired",
          name: "UnauthorizedError",
          code: 401,
          type: "UNAUTHORIZED",
        })
      );
    }

    // Slides expiration
    user.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    req.user = user;

    console.log("✅ validateToken");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateToken;
