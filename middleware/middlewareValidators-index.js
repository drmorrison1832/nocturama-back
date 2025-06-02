const validateArticleExists = require("./validateArticleExists");
const validateArticleInput = require("./validateArticleInput");
const validateToken = require("./validateToken");
const validateDates = require("./validateDates");
const validateID = require("./validateID");
const validateIsOwner = require("./validateIsOwner");
const validateLoginInput = require("./validateLoginInput");
const validateNewUserInput = require("./validateNewUserInput");
const validateResourceExists = require("./validateResourceExists");
const validateUserEmailExists = require("./validateUserEmailExists");

module.exports = {
  validateArticleExists,
  validateArticleInput,
  validateDates,
  validateID,
  validateIsOwner,
  validateLoginInput,
  validateNewUserInput,
  validateResourceExists,
  validateToken,
  validateUserEmailExists,
};
