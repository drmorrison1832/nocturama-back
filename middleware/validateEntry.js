function validateEntry(modelInstance) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry...");
    try {
      const entry = new modelInstance(req.body);
      await entry.validate();
      console.log("✅ Validation successful");
      next();
    } catch (error) {
      console.log(
        `Missing or invalid fields: ${Object.keys(error.errors).join(", ")}`
      );
      next(error);
    }
  };
}

module.exports = validateEntry;
