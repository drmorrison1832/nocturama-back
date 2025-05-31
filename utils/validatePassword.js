const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const { AppError } = require("./customErrors");

function validatePassword(hash, salt, password) {
  console.log("\n⚠️  validatePassword...");

  if (SHA256(password + salt).toString(encBase64) !== hash) {
    throw new AppError({
      message: "Wrong email or password",
      name: "unauthorizedError",
      code: 401,
      type: "UNAUTHORIZED",
    });
  }
  console.log("✅ validatePassword");
}

module.exports = validatePassword;
