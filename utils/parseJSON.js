const { JSONParseError } = require("./customErrors");

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
    throw new JSONParseError({
      name: e.name,
      message: "Invalid JSON format in request body",
      code: e.code,
      type: "INVALID_JSON",
      details: e.message,
    });
  }
}

module.exports = parseJSON;
