function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError...");

  console.log("error name is", err?.name);
  // console.log("❌❌❌❌ error is");
  // Object.keys(err).forEach((key) => {
  //   console.log(key, ":", err[key]);
  // });

  const ERROR_TYPES = {
    NOT_FOUND: { statusCode: 404 },
    BAD_REQUEST: { statusCode: 400 },
    UNAUTHORIZED: { statusCode: 401 },
    FORBIDDEN: { statusCode: 403 },
    CONFLICT: { statusCode: 409 },
    VALIDATION_ERROR: { statusCode: 422 },
    INTERNAL_ERROR: { statusCode: 500 },
    DATABASE_ERROR: { statusCode: 500 },
    SORT_ERROR: { statusCode: 400 },
  };

  const errorResponse = {
    status: err.status || err.status || "error",
    type: err.type || "INTERNAL_ERROR",
    code: err.statusCode || err.code || 500,
    message: err.message || "Internal server error",
    details: err.details || null,
  };

  // Mongoose Validation Error (DB entry doesn't match schema)
  if (err.name === "ValidationError") {
    // errorResponse.message = err._message;
    return res.status(errorResponse.code).json(errorResponse);
  }

  // Mongoose Cast Error (invalid ID format)
  if (err.name === "CastError") {
    return res.status(errorResponse.code).json(errorResponse);
  }

  // Mongoose Parse Error (invlalid JSON)
  if (err instanceof SyntaxError) {
    console.log("❌ Invalid JSON format in request body");
    const details = err.message; // MongoDB creates this key automatically

    errorResponse.status = "error";
    errorResponse.type = "INVALID_JSON";
    errorResponse.message = "Invalid JSON format in request body";
    errorResponse.details = details;
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
