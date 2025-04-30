const { AppError, JSONParseError } = require("../utils/customErrors");

function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError...");
  console.log("error name is", err.name);

  // Convert mongoDB native error objects into custom AppError
  if (err instanceof SyntaxError) {
    const customError = new JSONParseError(err);
    delete err.message; // For some reason the JSONParseError constructor won't overwrite err.message
    Object.setPrototypeOf(err, customError); // Change err class
    Object.assign(err, customError);
    err.log();
  }

  // Build response object
  const errorResponse = {
    status: err.status || "error",
    type: err.type || "INTERNAL_SERVER_ERROR",
    code: err.statusCode || err.code || 500,
    message:
      err.message ||
      "The server was unable to complete your request. Please try again later.",
    details: err.details || null,
  };

  if (
    err.name === "validationError" ||
    err.name === "CastError" ||
    err.name === "SyntaxError"
  ) {
    return res.status(errorResponse.code).json(errorResponse);
  }

  // Mongoose Not Found Error
  if (err.name === "NotFoundError") {
    return res.status(errorResponse.code).json(errorResponse);
  }

  // Sorting errors
  if (err.message.includes("Invalid sort")) {
    console.log("❌ Sorting error:", err.message);

    console.log(errorResponse);

    // return res.status(errorResponse.code).json(errorResponse);

    return res.status(400).json({
      status: "error",
      type: "SORT_ERROR",
      message: err.message,
    });
  }

  // Pagination errors
  if (err.message.includes("Page not found")) {
    console.log("❌ Pagination error:", err.message);
    return res.status(404).json({
      status: "error",
      type: "PAGINATION_ERROR",
      message: err.message,
      pagination: err.pagination,
    });
  }

  // Date errors
  if (err.type === "DATE_ERROR") {
    console.log("❌ Date error:", err.message);
    return res.status(errorResponse.code).json(errorResponse);
  }

  if (err.type === "INVALID_QUERY_PARAM") {
    console.log("❌ Query error:", err.message);
    return res.status(errorResponse.code).json(errorResponse);
  }

  // MongoDB Duplicate Key Error
  if (err.code === 11000) {
    console.log("❌ Duplicate key error");
    return res.status(409).json({
      status: "error",
      message: "Duplicate key error",
      field: Object.keys(err.keyPattern)[0],
    });
  }

  // Default for unhandled errors
  console.log("❌ Unknown error:", err);
  return res.status(errorResponse.code).json(errorResponse);

  return res.status(400).json({
    message: `Missing or invalid fields: ${Object.keys(error.errors).join(
      ", "
    )}`,
    errors: Object.values(error.errors).map((err) => err.message),
  });
}

module.exports = handleJsonError;
