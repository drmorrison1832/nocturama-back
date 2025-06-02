const { ValidationError } = require("../utils/customErrors");
const Article = require("../models/article-model");

async function validateArticleInput(req, res, next) {
  console.log("\n⚠️  validateArticleInput...");

  try {
    const entry = new Article(req.body);
    await entry.validate();
    console.log("✅ validateArticleInput");
    return next();
  } catch (error) {
    console.log("❌ validateArticleInput failed");
    console.log(error);
    return next(
      new ValidationError({
        message: error._message,
        errors: error.errors,
      })
    );
  }
}

module.exports = validateArticleInput;
