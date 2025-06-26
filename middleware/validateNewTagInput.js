const { ValidationError } = require("../utils/customErrors");
const Tag = require("../models/tag-model");

async function validateNewTagInput(req, res, next) {
  console.log("\n⚠️  validateNewTagInput...");

  try {
    const newTag = new Tag(req.body);
    newTag.createdBy = req.user._id;
    await newTag.validate();

    req.newTag = newTag;

    console.log("✅ validateNewTagInput");
    return next();
  } catch (error) {
    console.log("❌ validateNewTagInput failed");
    console.log(error);
    return next(
      new ValidationError({
        message: error._message,
        errors: error.errors,
      })
    );
  }
}

module.exports = validateNewTagInput;
