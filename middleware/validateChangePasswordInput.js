const { ValidationError } = require("../utils/customErrors");

function validateChangePasswordInput(req, res, next) {
  console.log("\n⚠️  validateChangePasswordInput...");
  try {
    // New password and confirmation provided?
    if (!req?.body?.newPassword || !req?.body?.confirmNewPassword) {
      console.log("❌ Missing new password or confirmation in req.body");
      return next(
        new ValidationError({
          message: "New password and confirmation missing",
          code: 400,
          details:
            "Both new password and new password confirmation must be provided",
        })
      );
    }

    // Password is string?
    if (typeof req?.body?.newPassword !== "string") {
      console.log("❌ Wrong req.body.newPassword type");
      return next(
        new ValidationError({
          message: "New password must be a string",
          code: 400,
        })
      );
    }

    //Password matches confirmation?
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return next(
        new ValidationError({
          message: "Passwords don't match",
          code: 400,
          details:
            "New password and new password confirmation must be identical",
        })
      );
    }

    console.log("✅ validateChangePasswordInput");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateChangePasswordInput;
