function parseShow(show) {
  switch (show) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      const err = new Error();
      err.status = "error";
      err.type = "INVALID_QUERY_PARAM";
      err.code = 400;
      err.message = "Invalid show parameter value";
      err.details = `Show must be true, false or undefined. Received: ${show}`;
      throw err;
  }
}

module.exports = parseShow;
