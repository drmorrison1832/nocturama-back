function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError:", err.name);

  function buildErrorResponse(error) {
    return {
      status: "error",
      type: error.type || "INTERNAL_SERVER_ERROR",
      code: error.statusCode || error.code || 500,
      message:
        error.message ||
        "The server was unable to complete your request. Please try again later.",
      details: error.details || null,
    };
  }

  const errorResponse = buildErrorResponse(err);

  switch (err.name) {
    case "ValidationError": // from validateEntry.js
    case "CastError": // from validateID.js
    case "NotFoundError": // from validateResourceExists.js
    case "BadRequestError": // from validateDates.js, parseShow.js, parseSort.js,
      err.log();
      return res.status(errorResponse.code).json(errorResponse);
    case "SyntaxError": // from parseJSON.js
      errorResponse.code = 400; // For some reason, parseJSON.js won't change errorResponse.code.
      err.log();
      return res.status(errorResponse.code).json(errorResponse);
    default:
      console.log("❌ Default error");
      return res.status(errorResponse.code).json(errorResponse);
  }
}

module.exports = handleJsonError;

//  MongoDB Duplicate Key Error
//  if (err.code === 11000) {
//   console.log("❌ Duplicate key error");
//   return res.status(409).json({
//     status: "error",
//     message: "Duplicate key error",
//     field: Object.keys(err.keyPattern)[0],
//   });
// }
