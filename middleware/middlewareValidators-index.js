const validateArticleExists = require("./validateArticleExists");
const validateAuthorization = require("./validateAuthorization");
const validateDates = require("./validateDates");
const validateEntry = require("./validateEntry");
const validateID = require("./validateID");
const validateLoginInput = require("./validateLoginInput");
const validateNewUserInput = require("./validateNewUserInput");
const validateResourceExists = require("./validateResourceExists");
const validateUserEmailExists = require("./validateUserEmailExists");

module.exports = {
  validateArticleExists,
  validateAuthorization,
  validateDates,
  validateEntry,
  validateID,
  validateLoginInput,
  validateNewUserInput,
  validateUserEmailExists,
  validateResourceExists,
};
