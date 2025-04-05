function validateEntry(modelInstance) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateEntry");
    try {
      const entry = new modelInstance(req.body);
      await entry.validate();
      console.log("→ OK");
      next();
    } catch (error) {
      console.log(
        `Missing or invalid fields: ${Object.keys(error.errors).join(", ")}`
      );

      return res.status(400).json({
        message: `Missing or invalid fields: ${Object.keys(error.errors).join(
          ", "
        )}`,
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
  };
}

module.exports = validateEntry;
