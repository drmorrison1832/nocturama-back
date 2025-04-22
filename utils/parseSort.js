const SORTING_FIELDS = ["title", "author", "created"];

const parsedOrder = {};

function parseSort(sort) {
  sort.split(",").forEach((criterion) => {
    const [field, direction = "asc"] = criterion.split(":");

    // Validate sorting criterium
    if (!SORTING_FIELDS.includes(field)) {
      const error = new Error(`Invalid sort field: ${field}`);
      error.type = "INVALID_SORT_CRITERION";
      error.code = 400;
      throw error;
    }
    if (direction && !["asc", "desc"].includes(direction)) {
      const error = new Error(`Invalid sort direction: ${direction}`);
      error.type = "INVALID_SORT_DIRECTION";
      error.code = 400;
      throw error;
    }

    parsedOrder[field] = direction === "desc" ? -1 : 1;
  });
  console.log(parsedOrder);
  return parsedOrder;
}

module.exports = parseSort;
