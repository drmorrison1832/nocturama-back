const router = require("express").Router();

const Article = require("../models/article");
const validateEntry = require("../middleware/validateEntry");
const validateId = require("../middleware/validateId");
const validateDates = require("../middleware/validateDates");

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

const SORTING_FIELDS = ["title", "date", "author"];
const SEARCH_FIELDS = ["title", "author", "description"];

router.post("/articles", validateEntry(Article), async (req, res, next) => {
  try {
    const newArticle = new Article(req.body);
    const response = await newArticle.save();
    console.log("✅ Article saved");
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/articles", validateDates, async (req, res, next) => {
  const {
    skip = 0,
    limit = PAGINATION.DEFAULT_LIMIT,
    sort,
    search,
    startDate,
    endDate,
  } = req.query;

  const { parsedSkip, parsedLimit } = parsePagination(skip, limit);

  const query = {};

  if (search) {
    query.$or = SEARCH_FIELDS.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  if (startDate || endDate) {
    query.date = {
      $gte: startDate ? new Date(startDate) : null,
      $lte: endDate ? new Date(endDate) : null,
    };
  }

  const order = {};
  if (sort) {
    sort.split(",").forEach((criterion) => {
      const [field, direction = "asc"] = criterion.split(":");

      // Validate sorting criterium
      if (!SORTING_FIELDS.includes(field)) {
        throw new Error(`Invalid sort field: ${field}`);
      }
      if (direction && !["asc", "desc"].includes(direction)) {
        throw new Error(`Invalid sort direction: ${direction}`);
      }

      order[field] = direction === "desc" ? -1 : 1;
    });
  }

  try {
    const [articles, total] = await Promise.all([
      Article.find(query).sort(order).skip(parsedSkip).limit(parsedLimit),
      Article.countDocuments(query),
    ]);

    // Handle no results
    if (!articles.length && total > 0 && skip > 0) {
      return res.status(404).json({
        message: "Page not found",
        pagination: { total, skip, limit },
      });
    }

    return res.status(200).json({
      articles,
      pagination: {
        total,
        skip,
        limit,
        hasMore: total > skip + limit,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/articles", async (req, res, next) => {
  return res.status(200).json("Something");
});

router.delete("/articles/:id", validateId, async (req, res, next) => {
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
    next(error);
  }
});

function parsePagination(skip, limit) {
  const parsedSkip = Math.max(0, Number(skip));
  const parsedLimit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, Number(limit))
  );
  return { parsedSkip, parsedLimit };
}

module.exports = router;
