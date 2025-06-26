const router = require("express").Router();
const validateNewTagInput = require("../middleware/validateNewTagInput");
const validateToken = require("../middleware/validateToken");
const Tag = require("../models/tag-model");
const { AppError } = require("../utils/customErrors");

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 20,
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

router.use(limiter);

router.post("/", validateToken, validateNewTagInput, async (req, res, next) => {
  try {
    const newTag = req.newTag;
    const savedTag = await Tag.create(newTag);
    console.log(savedTag);
    const response = await savedTag.populate("createdBy", "email");
    console.log(response);
    res.status(201).json(response);
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new AppError({
          name: "DuplicateKeyError",
          message: `Tag already exists`,
          type: "DUPLICATE_KEY",
          code: 409,
        })
      );
    }
    next(error);
  }
});

// Read all tags
router.get("/", async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    next(error);
  }
});

// Update tag
router.put("/:id", async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(tag);
  } catch (error) {
    next(error);
  }
});

// Delete tag
router.delete("/:slug", async (req, res, next) => {
  try {
    console.log(req.params.slug);
    await Tag.findByIdAndDelete(req.params.slug);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
