const validateArticleExists = require("./validateArticleExists");
const validateDates = require("./validateDates");
const validateEntry = require("./validateEntry");
const validateID = require("./validateID");
const validateLoginInput = require("./validateLoginInput");
const validateNewUserInput = require("./validateNewUserInput");
const validateResourceExists = require("./validateResourceExists");
const validateToken = require("./validateToken");
const validateUserEmailExists = require("./validateUserEmailExists");

module.exports = {
  validateArticleExists,
  validateDates,
  validateEntry,
  validateID,
  validateLoginInput,
  validateNewUserInput,
  validateToken,
  validateUserEmailExists,
  validateResourceExists,
};
