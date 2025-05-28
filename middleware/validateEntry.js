const { ValidationError } = require("../utils/customErrors");

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

      const err = new ValidationError({
        message: error._message,
        errors: error.errors,
      });

      throw err;
    }
  };
}

module.exports = validateEntry;
