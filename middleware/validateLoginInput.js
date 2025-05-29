const { ValidationError } = require("../utils/customErrors");
const { isValidEmail, isValidPassword } = require("../utils/validators-index");

function validateLoginInput(req, res, next) {
  console.log("\n⚠️  validateLoginInput...");

  // Maild provided?
  if (!req?.body?.email) {
    console.log("❌ No email in req.body");
    return next(
      new ValidationError({
        message: "Email address required",
        code: 400,
      })
    );
  }

  // Password provided?
  if (!req?.body?.password) {
    console.log("❌ Missing password in req.body");
    return next(
      new ValidationError({
        message: "Password required",
        code: 400,
      })
    );
  }

  // Email and password are strings?
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

  //Password matches confirmation?
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(
      new ValidationError({
        message: "Passwords don't match",
        code: 400,
        details: "Password and password confirmation must be identical",
      })
    );
  }

  //Email is well formatted
  if (!isValidEmail(req?.body?.email)) {
    console.log("❌ Wrong email format");
    return next(
      new ValidationError({
        message: "Invalid email address format",
        code: 400,
        details: `Received: ${req?.body?.email}`,
      })
    );
  }

  // Password strength validation?
  //   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  //   if (!passwordRegex.test(password)) {
  //     return next(
  //       new AppError({
  // name: "ValidationError",
  //         message: "Password is too weak",
  //         type: "VALIDATION_ERROR",
  //         code: 400,
  //         details:
  //           "Password must contain at least 8 characters, including uppercase, lowercase, numbers and special characters",
  //       })
  //     );
  //   }

  console.log("✅ validateNewUserInput");
  return next();
}

module.exports = validateLoginInput;
