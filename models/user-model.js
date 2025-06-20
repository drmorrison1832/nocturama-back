const mongoose = require("mongoose");
const validateEntry = require("../middleware/validateArticleInput");
const { escape } = require("validator");

mongoose.Schema.Types.String.set("trim", true);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
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
  },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  active: { type: Boolean, default: true },
});

userSchema.pre(/^find/, function (next) {
  console.log("Acessing user...");
  next();
});

userSchema.pre("save", function (next) {
  wasNewUser = this.isNew;
  next();
});

userSchema.post("save", async function (doc) {
  // wasNewUser ? console.log("✅ User created") : console.log("✅ User updated");
});

const User = mongoose.model("User", userSchema);

module.exports = User;
