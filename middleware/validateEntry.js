function validateEntry(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry...");
    try {
      const entry = new Model(req.body);
      await entry.validate();
      console.log("✅ Validation successful");
      return next();
    } catch (err) {
      console.log("❌ Validation failed");

      err.status = "error";
      err.type = "VALIDATION_ERROR";
      err.statusCode = 422;
      err.message = err._message;
      err.details = `Missing or invalid fields: ${Object.keys(err.errors).join(
        ", "
      )}`;

      next(err);
    }
  };
}

module.exports = validateEntry;
