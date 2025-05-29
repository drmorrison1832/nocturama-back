class AppError extends Error {
  constructor({ name, message, code, type, details }) {
    // console.log("Building AppError...");
    super(message || "Something went wrong on server side");
    this.name = name || "internalServerError";
    this.status = "error";
    this.code = code || 500;
    this.type = type || "INTERNAL_SERVER_ERROR";
    this.details = details || null;
  }
  log() {
    console.log("❌ Error:", this.message);
    Object.keys(this).forEach((key) => console.log("❌", key, ":", this[key]));
    console.log("");
  }
}

class JSONParseError extends AppError {
  constructor({ name, message, code, type, details }) {
    super({
      name: name,
      message: message || "Invalid JSON format in request body",
      code: code || 400,
      type: type || "INVALID_JSON", // or should it be "BAD_REQUEST"?
      details: details || null,
    });
  }
}

class ValidationError extends AppError {
  constructor({ name, _message, message, code, type, details, errors }) {
    super({
      name: name || "ValidationError",
      message: _message || message,
      code: code || 422,
      type: type || "VALIDATION_ERROR",
    });

    this.details = errors
      ? `Missing or invalid fields: ${Object.keys(errors).join(", ")}`
      : details || null;
  }
}

module.exports = { AppError, ValidationError, JSONParseError };
