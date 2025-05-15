const { AppError } = require("../utils/customErrors");

const SORTING_FIELDS = ["title", "author", "created"];

const parsedOrder = {};

function parseSort(sort) {
  sort.split(",").forEach((criterion) => {
    const [field, direction = "asc"] = criterion.split(":");

    // Validate sorting criterium
    if (!SORTING_FIELDS.includes(field)) {
      const error = new AppError({
        message: "Invalid request",
        name: "BadRequestError",
        code: 400,
        type: "INVALID_SORT_FIELD",
        details: `Invalid sort field: ${field}`,
      });

      throw error;
    }
    if (direction && !["asc", "desc"].includes(direction)) {
      const error = new AppError({
        message: "Invalid request",
        name: "BadRequestError",
        code: 400,
        type: "INVALID_SORT_DIRECTION",
        details: `Invalid sort field value for ${field}: ${direction}`,
      });

      throw error;
    }

    parsedOrder[field] = direction === "desc" ? -1 : 1;
  });

  return parsedOrder;
}

module.exports = parseSort;
