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

module.exports = isValidDate;
