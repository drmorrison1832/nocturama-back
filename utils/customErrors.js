class AppError extends Error {
  constructor({ name, message, code, type, details }) {
    super(message || "Something went wrong on server side");
    this.name = name || "internalServerError";
    this.status = "error";
    this.code = code || 500;
    this.type = type || "INTERNAL_SERVER_ERROR";
    this.details = details || null;
  }

  log() {
    console.log("");
    console.log("❌ Error:", this.message);
    Object.keys(this).forEach((key) => console.log("❌", key, ":", this[key]));
    console.log("");
  }
}

class JSONParseError extends AppError {
  constructor(MongoDbSyntaxError) {
    super({
      name: MongoDbSyntaxError.name,
      message: "Invalid JSON format in request body",
      code: 400,
      type: "BAD_REQUEST",
      details: MongoDbSyntaxError.message,
    });
  }
}

class ValidationError extends AppError {
  constructor(MongoDbValidationError) {
    super({
      name: "validationError",
      message: MongoDbValidationError._message,
      code: 422,
      type: "VALIDATION_ERROR",
    });
    this.details =
      MongoDbValidationError?.errors &&
      `Missing or invalid fields: ${Object.keys(
        MongoDbValidationError.errors
      ).join(", ")}`;
  }
}

module.exports = { AppError, ValidationError, JSONParseError };
