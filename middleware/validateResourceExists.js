const mongoose = require("mongoose");

function validateResourceExists(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateResourceExists...");
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid ID format");
        error.name = "CastError";
        error.message = "Invalid ID format";
        error.status = "error";
        error.code = 400;
        error.type = "INVALID_ID";
        error.details = req?.params?.id || null;

        throw error;
      }

      const exists = await Model.exists({ _id: id });

      if (!exists) {
        console.log("❌ Resource not found");
        const error = new Error("❌ Resource not found");
        error.name = "NotFoundError";
        error.message = "Resource not found";
        error.status = "error";
        error.code = 404;
        error.type = "NOT_FOUND";
        error.details = `Ressource not found ${Object.keys(Model)[0]} with ID ${
          req.params.id
        }`;

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
