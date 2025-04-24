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
    if (!isValidDate(datesToValidate[date])) {
      console.log("❌❌❌❌❌");
      const err = new Error("Invalid date format");
      err.status = "error";
      err.type = "DATE_ERROR";
      err.statusCode = 400;
      err.message = "Wrong date format";
      err.details = `${date}: date must be in YYYY-MM-DD format`;
      throw err;
    }
  });

  if (createdStartDate && createdEndDate) {
    validatePeriod(createdStartDate, createdEndDate);
  }

  if (updatedStartDate && updatedEndDate) {
    validatePeriod(updatedStartDate, updatedEndDate);
  }

  next();
}

module.exports = validateDates;

function validatePeriod(startDate, endDate) {
  if (startDate && endDate) {
    console.log("validate dates order:", startDate, endDate);

    if (new Date(startDate) > new Date(endDate)) {
      const err = new Error("Invalid date range");
      err.statusCode = 400;
      err.status = "error";
      err.type = "DATE_ERROR";
      err.message = "Wrong date range";
      err.details =
        "Creation and update dates: end date can't be smaller than start date";
      throw err;
    }
    console.log("OK");
  }
}
