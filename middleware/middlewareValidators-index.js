const sanitizeArticleInput = require("./sanitizeArticleInput");
const validateArticleExists = require("./validateArticleExists");
const validateArticleInput = require("./validateArticleInput");
const validateChangePasswordInput = require("./validateChangePasswordInput");
const validateDates = require("./validateDates");
const validateID = require("./validateID");
const validateIsOwner = require("./validateIsOwner");
const validateLoginInput = require("./validateLoginInput");
const validateNewUserInput = require("./validateNewUserInput");
const validatePasswordIsCorrect = require("./validatePasswordIsCorrect");
const validateResourceExists = require("./validateResourceExists");
const validateToken = require("./validateToken");
const validateUserIsActive = require("./validateUserIsActive");

module.exports = {
  sanitizeArticleInput,
  validateArticleExists,
  validateArticleInput,
  validateChangePasswordInput,
  validateDates,
  validateID,
  validateIsOwner,
  validateLoginInput,
  validateNewUserInput,
  validatePasswordIsCorrect,
  validateResourceExists,
  validateToken,
  validateUserIsActive,
};
