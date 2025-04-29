const { AppError, ValidationError } = require("../utils/customErrors");

// const fer = new AppError({
//   message: "Test error",
//   code: 999,
//   type: "VALIDATION_ERROR",
// });
// fer.log();

function validateEntry(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry...");
    try {
      const entry = new Model(req.body);
      await entry.validate();
      console.log("✅ Validation successful");
      return next();
    } catch (error) {
      console.log("❌ Validation failed");
      // console.log("❌ err is", err);

      const err = new ValidationError(error);

      err.log();

      // error.log();

      // err.status = "error";
      // err.type = "VALIDATION_ERROR";
      // err.statusCode = 422;
      // err.message = err._message;
      // err.details = `Missing or invalid fields: ${Object.keys(err.errors).join(
      //   ", "
      // )}`;

      // const error = new ValidationError(err);
      // console.log("❌❌ keys of error is", Object.keys(error));

      next(err);
    }
  };
}

module.exports = validateEntry;
