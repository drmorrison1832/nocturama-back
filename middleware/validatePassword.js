const { ValidationError } = require("../utils/customErrors");

function validatePassword(req, res, next) {
  console.log("\n⚠️  validatePassword...");

  if (!req?.body?.password || !req?.body?.confirmPassword) {
    console.log("MANQUE UN DES DEUX");
    return next(
      new ValidationError({
        message: "Password and confirmation are required",
        code: 400,
        details: "Both password and password confirmation must be provided",
      })
    );
  }

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

  // Password strength validation
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

  next();
}

module.exports = validatePassword;
