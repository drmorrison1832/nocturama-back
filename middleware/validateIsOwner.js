const { AppError } = require("../utils/customErrors");

async function validateIsOwner(req, res, next) {
  console.log("\n⚠️  validateIsOwner...");

  try {
    const isOwner = req.user._id.equals(req.article.owner);

    if (!isOwner) {
      console.log("❌ User is not owner");
      return next(
        new AppError({
          message: "Not authorized to modify this article",
          name: "ForbiddenError",
          code: 403,
          type: "FORBIDDEN",
          details: `User not authorized to modify article ${req.article._id}`,
        })
      );
    }

    console.log("✅ validateIsOwner");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateIsOwner;
