const sanitizeEmail = require("../utils/sanitizeEmail");
const User = require("../models/user-model");

// const SHA256 = require("crypto-js/sha256");
// const encBase64 = require("crypto-js/enc-base64");

const { verifyPassword } = require("../utils/passwordEncryption");

const { AppError } = require("../utils/customErrors");

async function validatePasswordIsCorrect(req, res, next) {
  console.log("\n⚠️  validatePasswordIsCorrect...");
  try {
    const email = sanitizeEmail(req?.body?.email || req?.user?.email);

    const user = await User.findOne({ email: email }).select("+hash +salt");

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

    if (!req?.user) {
      req.user = user;
    }

    const { password } = req.body;
    const { hash, salt } = user;

    if (!verifyPassword(hash, salt, password)) {
      throw new AppError({
        message: "Wrong email or password",
        name: "UnauthorizedError",
        code: 401,
        type: "UNAUTHORIZED",
      });
    }

    req.user.hash = "CENSORED by validatePasswordIsCorrect";
    req.user.salt = "CENSORED by validatePasswordIsCorrect";

    console.log("✅ validatePasswordIsCorrect");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validatePasswordIsCorrect;
