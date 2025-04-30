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
      // console.log("❌ error is", error);

      const err = new ValidationError(error);
      err.log();

      next(err);
    }
  };
}

module.exports = validateEntry;
