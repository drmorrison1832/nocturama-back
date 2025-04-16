function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError...");

  const ERROR_TYPES = {
    NOT_FOUND: { statusCode: err.statusCode || 404, type: "NOT_FOUND" },
    SORT: { statusCode: err.statusCode || 400, type: "INVALID_SORT" },
    DEFAULT: { statusCode: 500, type: "INTERNAL_ERROR" },
  };

  const errorResponse = {
    status: "error",
    type: ERROR_TYPES.DEFAULT.type,
    message: "Internal server error",
    details: null,
  };

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    errorResponse.status = err.status;
    errorResponse.type = err.type;
    errorResponse.message = err._message;
    errorResponse.details = err.details;
    return res.status(err.statusCode).json(errorResponse);
  }

  // Mongoose Cast Error (invalid ID format)
  if (err.name === "CastError") {
    errorResponse.status = err.status;
    errorResponse.type = err.type;
    errorResponse.message = err.message;
    errorResponse.details = err.details;
    return res.status(err.statusCode).json(errorResponse);
  }

  // JSON Parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.log("❌ Invalid JSON format in request body");
    errorResponse.status = err.status;
    errorResponse.type = "INVALID_JSON";
    errorResponse.message = "Invalid JSON format in request body";
    errorResponse.details = err?.body;
    return res.status(err.statusCode).json(errorResponse);
  }

  // Sorting errors
  if (err.message.includes("Invalid sort")) {
    console.log("❌ Sorting error:", err.message);

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
    errorResponse.status = err.status;
    errorResponse.type = err.type;
    errorResponse.message = err.message;
    errorResponse.details = err.details;
    return res.status(err.statusCode).json(errorResponse);
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
  console.log("❌ Internal server error:", err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });

  return res.status(400).json({
    message: `Missing or invalid fields: ${Object.keys(error.errors).join(
      ", "
    )}`,
    errors: Object.values(error.errors).map((err) => err.message),
  });
}

module.exports = handleJsonError;
