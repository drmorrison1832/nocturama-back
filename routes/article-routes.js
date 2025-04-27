// TO DO : add

const router = require("express").Router();

const Article = require("../models/article");
const validateEntry = require("../middleware/validateEntry");
const validateResourceExists = require("../middleware/validateResourceExists");
const validateDates = require("../middleware/validateDates");

const parsePagination = require("../utils/parsePagination");

const parseSort = require("../utils/parseSort");
const SEARCH_FIELDS = [
  "title",
  "author",
  "description",
  "createdStartDate",
  "createdEndDate",
  "updatedStartDate",
  "updatedEndDate",
];

router.post("/articles", validateEntry(Article), async (req, res, next) => {
  try {
    const newArticle = new Article(req.body);
    const response = await newArticle.save();

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

router.put(
  "/articles/:id",
  validateResourceExists(Article),
  validateEntry(Article),
  async (req, res, next) => {
    try {
      const existingArticle = await Article.findById(req.params.id);
      if (!existingArticle) {
        return res.status(404).json({ message: "Article not found" });
      }

      const replacementArticle = req.body;

      const hasChanges = Object.keys(replacementArticle).some(
        (key) =>
          existingArticle[key]?.toString() !==
          replacementArticle[key]?.toString()
      );

      if (!hasChanges) {
        return res.status(200).json({
          message: "Nothing to update",
          article: existingArticle,
        });
      }

      Object.assign(existingArticle, replacementArticle);
      const response = await existingArticle.save();

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
);

router.get("/articles", validateDates, async (req, res, next) => {
  const {
    skip = 0,
    limit,
    sort,
    search,
    createdStartDate,
    createdEndDate,
    updatedStartDate,
    updatedEndDate,
    shown,
  } = req.query;

  const { parsedSkip, parsedLimit } = parsePagination(skip, limit);

  const parsedOrder = sort ? parseSort(sort) : {};

  const query = {};

  if (search) {
    query.$or = SEARCH_FIELDS.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  query.created = {
    ...(createdStartDate && { $gte: new Date(createdStartDate) }),
    ...(createdEndDate && { $lte: new Date(createdEndDate) }),
    ...(updatedStartDate && { $gte: new Date(updatedStartDate) }),
    ...(updatedEndDate && { $lte: new Date(updatedEndDate) }),
  };

  // if (shown) {
  //   query.shown = shown;
  // }

  console.log("shown type is", typeof shown);
  console.log("shown is", shown);
  switch (shown) {
    case undefined:
      console.log("0");
      break;
    case "true":
      console.log("1");
      query.shown = true;
      break;
    case "false":
      console.log("2");
      query.shown = false;
      break;
    default:
      console.log("3");
      throw new Error(`show must be "true" or "false"`);
      break;
  }

  try {
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
      articles,
      pagination: {
        total,
        skip: parsedSkip,
        limit: parsedLimit,
        hasMore: total > parsedSkip + parsedLimit,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.delete(
  "/articles/:id",
  validateResourceExists(Article),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const article = await Article.findById(id);

      if (!article) {
        throw new Error("Article not found");
      }

      await Article.findByIdAndDelete(id);

      return res.status(200).json({
        status: "success",
        message: "Article deleted successfully",
        data: { id },
      });
    } catch {
      return next(error);
    }
  }
);

module.exports = router;
