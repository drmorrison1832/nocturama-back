const { AppError } = require("../utils/customErrors");

function requireRole(...roles) {
  return (req, res, next) => {
    console.log("\n⚠️  requireRole...");
    if (!req.user || !roles.includes(req.user.role)) {
      console.log("❌ requireRole failed");
      return next(
        new AppError({
          message: "Forbidden: insufficient permissions",
          name: "ForbiddenError",
          code: 403,
          type: "UNAUTHORIZED",
          details: `User role must be ${roles}`,
        })
      );
    }
    console.log("✅ requireRole");

    next();
  };
}

module.exports = requireRole;
