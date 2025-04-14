function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError...");

  // JSON Parsing errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.log("❌ Invalid JSON format in request body");
    return res.status(400).json({
      status: "error",
      message: "Invalid JSON format in request body",
    });
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
  if (err.message.includes("YYYY-MM-DD format")) {
    console.log("❌ Date format error:", err.message);
    return res.status(404).json({
      status: "error",
      type: "DATE_ERROR",
      message: err.message,
    });
  }

  // Mongoose Cast Error (invalid ID format)
  if (err.name === "CastError") {
    console.log("❌ Invalid ID format");
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
    });
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    console.log("❌ Validation failed");
    return res.status(400).json({
      status: "error",
      message: `Missing or invalid fields: ${Object.keys(err.errors).join(
        ", "
      )}`,
    });
  }

  return res.status(400).json({
    message: `Missing or invalid fields: ${Object.keys(error.errors).join(
      ", "
    )}`,
    errors: Object.values(error.errors).map((err) => err.message),
  });

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
}

module.exports = handleJsonError;
