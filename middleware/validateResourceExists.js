const { AppError } = require("../utils/customErrors");

const sanitizeEmail = require("../utils/sanitizeEmail");

function validateResourceExists(Model) {
  return async (req, res, next) => {
    console.log("\n⚠️  validateResourceExists...");

    try {
      let verificationKey;
      let verfcationValue;

      switch (Model.modelName) {
        case "Article":
          verificationKey = "_id";
          verificationValue = req.params.id;

          break;
        case "User":
          verificationKey = "email";
          verificationValue = sanitizeEmail(req.body.email);
        default:
          break;
      }

      let query = {};
      query[verificationKey] = verificationValue;

      const exists = await Model.exists(query);

      if (!exists) {
        console.log("❌ Resource not found");
        console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
        return next(
          new AppError({
            message: "Resource not found",
            name: "NotFoundError",
            code: 404,
            type: "NOT_FOUND",
            details: `${Model.modelName} not found with ${verificationKey}: ${verificationValue}`,
          })
        );
      }
      console.log("✅ validateResourceExists");
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = validateResourceExists;
