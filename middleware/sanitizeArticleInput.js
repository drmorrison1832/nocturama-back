const { body } = require("express-validator");

const sanitizeArticleInput = [
  body("title").trim().escape(),
  body("author").trim().escape(),
  body("mainImage").trim(),
  body("description").trim().escape(),
  body("link").trim(),
  // body("tags.*").trim().escape().toLowerCase(),
];

module.exports = sanitizeArticleInput;
