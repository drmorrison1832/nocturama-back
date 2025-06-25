const { AppError } = require("../utils/customErrors");

async function validateResourceExists(Model, query) {
  console.log("\n⚠️  validateResourceExists...");
  const exists = await Model.exists(query);

  if (!exists) {
    console.log("❌ Resource not found");
    throw new AppError({
      message: "Resource not found",
      name: "NotFoundError",
      code: 404,
      type: "NOT_FOUND",
      details: `${Model.modelName} not found.`,
    });
  }
  console.log("✅ validateResourceExists");
  return;
}

module.exports = validateResourceExists;
