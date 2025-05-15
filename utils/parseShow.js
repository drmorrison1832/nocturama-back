const { AppError } = require("../utils/customErrors");

function parseShow(show) {
  switch (show) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      const error = new AppError({
        message: "Invalid query parameter",
        name: "BadRequestError",
        code: 400,
        type: "INVALID_QUERY_PARAM",
        details: `Show must be true, false or undefined. Received: ${show}`,
      });

      throw error;
  }
}

module.exports = parseShow;
