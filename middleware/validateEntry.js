function validateEntry(modelInstance) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry...");
    try {
      const entry = new modelInstance(req.body);
      await entry.validate();
      console.log("✅ Validation successful");
      next();
    } catch (err) {
      console.log("❌ Validation failed");

      err.status = "error";
      err.statusCode = 400;
      err.type = "VALIDATION_ERROR";
      err.details = `Missing or invalid fields: ${Object.keys(err.errors).join(
        ", "
      )}`;

      next(err);
    }
  };
}

module.exports = validateEntry;
