// const { DEFAULT_LIMIT, MAX_LIMIT } = require("./paginationDefaults");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parsePagination(skip, limit) {
  const parsedSkip = Math.max(0, Number(skip));
  const parsedLimit = limit
    ? Math.min(MAX_LIMIT, Math.max(1, Number(limit)))
    : DEFAULT_LIMIT;

  return { parsedSkip, parsedLimit };
}

module.exports = parsePagination;
