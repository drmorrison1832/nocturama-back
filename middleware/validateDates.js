const isValidDate = require("../utils/isValidDate");

function validateDates(req, res, next) {
  console.log("\n⚠️  validateDates...");

  if (!req?.query?.startDate && !req?.query?.endDate) {
    console.log("✅ No dates to validate");
    return next();
  }

  const { startDate, endDate } = req.query;

  if (startDate && !isValidDate(startDate)) {
    console.log("❌❌❌❌❌");
    const err = new Error("Invalid start date format");
    err.status = "error";
    err.type = "DATE_ERROR";
    err.statusCode = 400;
    err.message = "Wrong date format";
    err.details = "Start date must be in YYYY-MM-DD format";
    return next(err);
  }

  if (endDate && !isValidDate(endDate)) {
    console.log("❌❌❌❌❌");
    const err = new Error("Invalid end date format");
    err.status = "error";
    err.type = "DATE_ERROR";
    err.statusCode = 400;
    err.message = "Wrong date format";
    err.details = "End date must be in YYYY-MM-DD format";
    return next(err);
  }

  if (startDate && endDate) {
    if (new Date(startDate) > new Date(endDate)) {
      const err = new Error("Invalid date range");
      err.statusCode = 400;
      err.status = "error";
      err.type = "DATE_ERROR";
      err.message = "Wrong date range";
      err.details = "End date must be equal or later than start date";
      return next(err);
    }
  }

  next();
}

module.exports = validateDates;
