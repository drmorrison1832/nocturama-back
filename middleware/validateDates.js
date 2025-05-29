const { AppError } = require("../utils/customErrors");
const isValidDate = require("../utils/isValidDate");

function validateDates(req, res, next) {
  console.log("\n⚠️  validateDates...");

  if (!req?.query?.createdStartDate && !req?.query?.createdEndDate) {
    console.log("✅ No dates to validate");
    return next();
  }

  const { createdStartDate, createdEndDate, updatedStartDate, updatedEndDate } =
    req.query;

  const datesToValidate = {
    createdStartDate,
    createdEndDate,
    updatedStartDate,
    updatedEndDate,
  };

  Object.keys(datesToValidate).forEach((date) => {
    if (!datesToValidate[date]) {
      return delete datesToValidate[date]; // MongoDB will throw error if date is undefined
    }

    if (!isValidDate(datesToValidate[date])) {
      console.log("❌ Invalid date format:", datesToValidate[date]);

      return next(
        new AppError({
          message: "Invalid date format",
          name: "BadRequestError",
          code: 400,
          type: "INVALID_QUERY_PARAM",
          details: `Wrong date format: ${datesToValidate[date]}. Date must be in YYYY-MM-DD format`,
        })
      );
    }
  });

  if (createdStartDate && createdEndDate) {
    validatePeriod(createdStartDate, createdEndDate);
  }

  if (updatedStartDate && updatedEndDate) {
    validatePeriod(updatedStartDate, updatedEndDate);
  }
  console.log("✅ validateDates");
  next();
}

module.exports = validateDates;

function validatePeriod(startDate, endDate) {
  console.log("\n⚠️  validatePeriod...");
  if (startDate && endDate) {
    if (new Date(startDate) > new Date(endDate)) {
      return next(
        new AppError({
          message: "Invalid dates range",
          name: "BadRequestError",
          code: 400,
          type: "INVALID_QUERY_PARAM",
          details:
            "Creation and update dates: end date must be later than start date",
        })
      );
    }
    console.log("✅ validatePeriod");
  }
}
