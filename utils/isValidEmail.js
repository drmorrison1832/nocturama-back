const validator = require("validator");

function isValidEmail(email) {
  // console.log("\n⚠️  isValidEmail...");

  return validator.isEmail(email, {
    // allow_utf8_local_part: false, // default: true
    // require_tld: true, // default: true
    // allow_ip_domain: false, // default: false
    allow_plus_sign: true,
  });
}

module.exports = isValidEmail;
