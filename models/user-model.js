const mongoose = require("mongoose");
const validateEntry = require("../middleware/validateEntry");

mongoose.Schema.Types.String.set("trim", true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  hash: {
    type: String,
    required: true,
    select: false,
  },
  salt: {
    type: String,
    required: true,
    select: false,
  },
  token: {
    type: String,
    required: true,
  },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
