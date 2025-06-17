const { ValidationError } = require("../utils/customErrors");
const { isValidEmail, isValidPassword } = require("../utils/validators-index");

function validateNewUserInput(req, res, next) {
  console.log("\n⚠️  validateNewUserInput...");

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

  // Password and confirmation provided?
  if (!req?.body?.password || !req?.body?.confirmPassword) {
    console.log("❌ Missing password or confirmation in req.body");
    return next(
      new ValidationError({
        message: "Password and confirmation missing",
        code: 400,
        details: "Both password and password confirmation must be provided",
      })
    );
  }

  // Email and password are strings?
  if (typeof req?.body?.email !== "string") {
    console.log("❌ Wrong req.body.email type");
    return next(
      new ValidationError({
        message: "Email address must be a string",
        code: 400,
        details: `Received: ${req?.body?.email}`,
      })
    );
  }

  if (typeof req?.body?.password !== "string") {
    console.log("❌ Wrong req.body.password type");
    return next(
      new ValidationError({
        message: "Password must be a string",
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

  //Email is well formated
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

module.exports = validateNewUserInput;
