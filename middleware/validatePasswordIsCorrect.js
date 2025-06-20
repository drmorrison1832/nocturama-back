const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const { AppError } = require("../utils/customErrors");

function validatePasswordIsCorrect(req, res, next) {
  console.log("\n⚠️  validatePasswordIsCorrect...");

  const { password } = req.body;
  const { hash, salt } = req.user;

  if (SHA256(password + salt).toString(encBase64) !== hash) {
    throw new AppError({
      message: "Wrong email or password",
      name: "UnauthorizedError",
      code: 401,
      type: "UNAUTHORIZED",
    });
  }
  // req.user.hash = "CENSORED by validatePasswordIsCorrect";
  // req.user.salt = "CENSORED by validatePasswordIsCorrect";

  req.user.hash = false;
  req.user.salt = false;

  console.log("✅ validatePasswordIsCorrect");
  next();
}

module.exports = validatePasswordIsCorrect;
