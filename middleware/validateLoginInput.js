const { ValidationError } = require("../utils/customErrors");
const { isValidEmail, isValidPassword } = require("../utils/validators-index");

function validateLoginInput(req, res, next) {
  console.log("\n⚠️  validateLoginInput...");

  // Email provided?
  if (!req?.body?.email) {
    console.log("❌ No email in req.body");
    return next(
      new ValidationError({
        message: "Email address is required",
        code: 400,
      })
    );
  }

  // Password provided?
  if (!req?.body?.password) {
    console.log("❌ Missing password in req.body");
    return next(
      new ValidationError({
        message: "Password is required",
        code: 400,
      })
    );
  }

  // Email valid?
  if (!isValidEmail(req?.body?.email)) {
    console.log("❌ Invalid email");
    return next(
      new ValidationError({
        message: "Invalid email",
        code: 400,
        details: `Received: ${req?.body?.email}`,
      })
    );
  }

  if (!isValidPassword(req?.body?.password)) {
    console.log("❌ Wrong req.body.password format");
    return next(
      new ValidationError({
        message: "Password must be...",
        code: 400,
      })
    );
  }

  console.log("✅ validateNewUserInput");
  return next();
}

module.exports = validateLoginInput;
