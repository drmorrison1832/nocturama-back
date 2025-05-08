const mongoose = require("mongoose");
const { AppError } = require("../utils/customErrors");

function validateResourceExists(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateResourceExists...");
    try {
      const { id } = req.params;

      const exists = await Model.exists({ _id: id });

      if (!exists) {
        console.log("❌ Resource not found");

        const error = new AppError({
          message: "Resource not found",
          name: "NotFoundError",
          code: 404,
          type: "NOT_FOUND",
          details: `Resource not found ${Object.keys(Model)[0]} with ID ${
            req.params.id
          }`,
        });

        error.log();
        throw error;
      }
      console.log("✅ ID validation successful");
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = validateResourceExists;
