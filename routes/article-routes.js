const router = require("express").Router();

// Import and set up time express-rate-limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  limit: 3,
  handler: (req, res, next, options) =>
    next(
      new AppError({
        message: "Too many tries.",
        code: 429,
        type: "TOO_MANY_REQUEST",
        name: "TooManyRequests",
      })
    ),
});

// Import models
const Article = require("../models/article-model");
const User = require("../models/user-model");

// Import custom middleware
const {
  sanitizeArticleInput,
  validateArticleExists,
  validateArticleInput,
  validateDates,
  validateID,
  validateIsOwner,
  validateResourceExists,
  validateToken,
} = require("../middleware/middlewareValidators-index");

// Import utils
const {
  parsePagination,
  parseShow,
  parseSort,
} = require("../utils/parsers-index");

// Enviroment variables
const SEARCH_FIELDS = [
  "title",
  "author",
  "description",
  "createdStartDate",
  "createdEndDate",
  "updatedStartDate",
  "updatedEndDate",
];

const KEYS_TO_COMPARE = [
  "title",
  "author",
  "mainImage",
  "description",
  "link",
  "show",
  "tags",
];

// Setup app

router.use(limiter);

router.post(
  "/",
  validateToken,
  sanitizeArticleInput,
  validateArticleInput,
  async (req, res, next) => {
    try {
      const newArticle = req.newArticle;

      const response = await newArticle.save();

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { articles: newArticle._id },
        },
        { new: true }
      );

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
  "/:id",
  validateToken,
  validateID,
  validateArticleExists,
  validateIsOwner,
  sanitizeArticleInput,
  validateArticleInput,
  async (req, res, next) => {
    try {
      let hasChanges = false;

      const normalizedNewArticle = req.newArticle.toObject();

      const existingArticle = await Article.findById(req.params.id);

      KEYS_TO_COMPARE.forEach((key) => {
        if (
          JSON.stringify(normalizedNewArticle[key]) !==
          JSON.stringify(existingArticle[key])
        ) {
          hasChanges = true;
          existingArticle[key] = normalizedNewArticle[key];
        }
      });

      if (!hasChanges) {
        return res.status(200).json({
          status: "success",
          message: "Nothing to update",
          data: { id: existingArticle._id },
        });
      }

      console.log(existingArticle.owner);

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

router.get("/", validateDates, async (req, res, next) => {
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

    const [data, total] = await Promise.all([
      Article.find(query).sort(parsedOrder).skip(parsedSkip).limit(parsedLimit),
      Article.countDocuments(query),
    ]);

    // Handle no results
    if (!data.length && total > 0 && skip > 0) {
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
      data,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete(
  "/:id",
  validateToken,
  validateID,
  validateArticleExists,
  validateIsOwner,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      validateResourceExists(Article, { _id: id });
      const deletedArticle = await Article.findByIdAndDelete(id);

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { articles: deletedArticle._id },
        },
        { new: true }
      );

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
  }
);

module.exports = router;
