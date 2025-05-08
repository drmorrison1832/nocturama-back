const { AppError, JSONParseError } = require("./customErrors");

function parseJSON(req, res, buf) {
  console.log("\n⚠️  parseJSON...");
  try {
    if (buf) {
      JSON.parse(buf);
      console.log("✅ JSON parsed");
    } else {
      console.log("No body");
    }
  } catch (e) {
    console.log("❌ JSON parsing failed");
    throw new JSONParseError(e);
  }
}

module.exports = parseJSON;
