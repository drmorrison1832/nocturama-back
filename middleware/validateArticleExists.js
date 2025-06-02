const { AppError } = require("../utils/customErrors");
const Article = require("../models/article-model");

async function validateArticleExists(req, res, next) {
  console.log("\n⚠️  validateArticleExists...");
  const id = req.params.id;

  try {
    const article = await Article.findById(id);

    if (!article) {
      console.log("❌ Article not found");
      return next(
        new AppError({
          message: "Article not found",
          name: "NotFoundError",
          code: 404,
          type: "NOT_FOUND",
          details: `Article not found with id: ${req}`,
        })
      );
    }

    req.article = article;
    console.log("✅ validateArticleExists");
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateArticleExists;
