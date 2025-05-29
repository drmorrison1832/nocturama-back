const { ValidationError } = require("../utils/customErrors");

function validateEntry(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry...");
    try {
      const entry = new Model(req.body);
      await entry.validate();
      console.log("✅ validateEntry");
      return next();
    } catch (error) {
      console.log("❌ Validation failed");
      return next(
        new ValidationError({
          message: error._message,
          errors: error.errors,
        })
      );
    }
  };
}

module.exports = validateEntry;
