const validator = require("validator");

function sanitizeEmail(email) {
  return validator.normalizeEmail(email, {
    all_lowercase: false,
    gmail_lowercase: true,
    gmail_remove_dots: true,
    gmail_remove_subaddress: false,
    gmail_convert_googlemaildotcom: true,
    outlookdotcom_lowercase: true,
    outlookdotcom_remove_subaddress: false,
    yahoo_lowercase: true,
    yahoo_remove_subaddress: false,
    icloud_lowercase: true,
    icloud_remove_subaddress: false,
  });
}

module.exports = sanitizeEmail;
