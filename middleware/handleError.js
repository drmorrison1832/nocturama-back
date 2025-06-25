function handleJsonError(err, req, res, next) {
  console.log("\n⚠️  handleError:", err.name);
  console.log("Error code is", err.code);

  !err?.code && console.error(err);

  const errorResponse = buildErrorResponse(err);

  switch (err.name) {
    case "ValidationError": // from validateEntry.js
    case "ForbiddenError": // from validateIsOwner.js
    case "UnauthorizedError": // from validateAuthorization.js
    case "CastError": // from validateID.js
    case "NotFoundError": // from validateResourceExists.js
    case "BadRequestError": // from validateDates.js, parseShow.js, parseSort.js,
    case "DuplicateKeyError":
    case "TooManyRequests": // from index.js express-rate-limit
      err.log && err.log();
      return res.status(err.code).json(buildErrorResponse(err));

    case "SyntaxError": // from parseJSON.js
      errorResponse.code = 400; // For some reason, parseJSON.js won't change errorResponse.code.
      err.log && err.log();
      return res.status(err.code).json(buildErrorResponse(err));

    default:
      console.log("❌ Unknown error");
      return res.status(err.code || 500).json(buildErrorResponse(err));
  }
}

function buildErrorResponse(error) {
  return {
    status: "error",
    type: error.type || "INTERNAL_SERVER_ERROR",
    code: error.code || 500,
    message:
      error.message ||
      "The server was unable to complete your request. Please try again later.",
    details: error.details || undefined,
  };
}

module.exports = handleJsonError;
