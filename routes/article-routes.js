const router = require("express").Router();

const Article = require("../models/article-model");

const {
  validateArticleExists,
  validateEntry,
  validateDates,
  validateID,
  validateResourceExists,
  validateAuthorization,
} = require("../middleware/middlewareValidators-index");

const {
  parsePagination,
  parseShow,
  parseSort,
} = require("../utils/parsers-index");

const SEARCH_FIELDS = [
  "title",
  "author",
  "description",
  "createdStartDate",
  "createdEndDate",
  "updatedStartDate",
  "updatedEndDate",
];

router.post(
  "/articles",
  validateAuthorization,
  validateEntry(Article, "_id", "id"),
  async (req, res, next) => {
    try {
      const newArticle = new Article(req.body);
      newArticle.owner = req.userID;
      const response = await newArticle.save();

      return res.status(201).json({
        status: "success",
        message: "Article created successfully",
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  "/articles/:id",
  validateID,
  validateArticleExists,
  validateEntry(Article),
  async (req, res, next) => {
    try {
      const keysToCompare = [
        "title",
        "author",
        "mainImage",
        "link",
        "show",
        "tags",
      ];

      const normalizedUpdates = new Article(req.body).toObject();
      const existingArticle = await Article.findById(req.params.id);

      let hasChanges = false;

      keysToCompare.forEach((key) => {
        if (
          JSON.stringify(normalizedUpdates[key]) !==
          JSON.stringify(existingArticle[key])
        ) {
          hasChanges = true;
          existingArticle[key] = normalizedUpdates[key];
        }
      });

      if (!hasChanges) {
        return res.status(200).json({
          status: "success",
          message: "Nothing to update",
          data: { id: existingArticle._id },
        });
      }

      const response = await existingArticle.save();

      return res.status(200).json({
        status: "success",
        message: "Article updated successfully",
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/articles", validateDates, async (req, res, next) => {
  try {
    const {
      skip = 0,
      limit,
      sort,
      search,
      createdStartDate,
      createdEndDate,
      updatedStartDate,
      updatedEndDate,
      show,
    } = req.query;

    const { parsedSkip, parsedLimit } = parsePagination(skip, limit);

    const parsedOrder = sort ? parseSort(sort) : {};

    const query = {};

    if (search) {
      query.$or = SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    if (
      createdStartDate ||
      createdEndDate ||
      updatedStartDate ||
      updatedEndDate
    ) {
      query.created = {
        ...(createdStartDate && { $gte: new Date(createdStartDate) }),
        ...(createdEndDate && { $lte: new Date(createdEndDate) }),
        ...(updatedStartDate && { $gte: new Date(updatedStartDate) }),
        ...(updatedEndDate && { $lte: new Date(updatedEndDate) }),
      };
    }

    if (show) {
      query.show = parseShow(show);
    }

    const [articles, total] = await Promise.all([
      Article.find(query).sort(parsedOrder).skip(parsedSkip).limit(parsedLimit),
      Article.countDocuments(query),
    ]);

    // Handle no results
    if (!articles.length && total > 0 && skip > 0) {
      return res.status(404).json({
        message: "Page not found",
        pagination: {
          total,
          skip: parsedSkip,
          limit: parsedLimit,
          hasMore: total > parsedSkip + parsedLimit,
        },
      });
    }

    return res.status(200).json({
      pagination: {
        total,
        skip: parsedSkip,
        limit: parsedLimit,
        hasMore: total > parsedSkip + parsedLimit,
      },
      articles,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/articles/:id", validateID, async (req, res, next) => {
  try {
    const { id } = req.params;
    validateResourceExists(Article, { _id: id });
    const deletedArticle = await Article.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Article deleted successfully",
      data: {
        id: deletedArticle._id,
        title: deletedArticle.title,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
