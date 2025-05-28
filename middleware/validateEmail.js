const { ValidationError } = require("../utils/customErrors");

async function validateEmail(req, res, next) {
  console.log("\n⚠️  validateEmail...");

  if (!req?.body?.email) {
    console.log("❌ No email in req.body");
    return next(
      new ValidationError({
        message: "Email address required",
        code: 400,
      })
    );
  }

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

  if (
    !req?.body?.email
      .toLowerCase()
      .trim()
      .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  ) {
    console.log("❌ Wrong email format");
    return next(
      new ValidationError(
        new ValidationError({
          message: "Invalid email address format",
          code: 400,
          details: `Received: ${req?.body?.email}`,
        })
      )
    );
  }
  return next();
}

module.exports = validateEmail;
