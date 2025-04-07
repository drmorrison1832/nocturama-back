const router = require("express").Router();

const Article = require("../models/article");
const validateEntry = require("../middleware/validateEntry");

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
};

const SORTING_FIELDS = ["title", "date", "author"];

const SEARCH_FIELDS = ["title", "author", "description"];

// const requireAuth = require("../middleware/requireAuth");
// router.use(requireAuth); // Ça s'applique à toutes les routes...

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

router.get("/articles", async (req, res, next) => {
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
    query.date = {};

    if (startDate) {
      if (!isValidDate(startDate)) {
        throw new Error("Start date must be in YYYY-MM-DD format");
      }
      query.date.$gte = new Date(startDate);
    }

    if (endDate) {
      if (!isValidDate(endDate)) {
        throw new Error("End date must be in YYYY-MM-DD format");
      }
      query.date.$lte = new Date(endDate);
    }
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

router.put("/articles", async (req, res) => {
  return res.status(200).json("Something");
});

router.delete("/articles", async (req, res) => {
  return res.status(200).json("Something");
});

function parsePagination(skip, limit) {
  const parsedSkip = Math.max(0, Number(skip));
  const parsedLimit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, Number(limit))
  );
  return { parsedSkip, parsedLimit };
}

function isValidDate(dateString) {
  // Check format YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);

  // Check if valid date and matches original string when formatted
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.toISOString().slice(0, 10) === dateString
  );
}

module.exports = router;
