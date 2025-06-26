const mongoose = require("mongoose");

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
  tokenExpiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    select: false,
  },
  passwordChangedAt: { type: Date, default: null, select: false },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
  active: { type: Boolean, default: true },
});

userSchema.pre(/^find/, function (next) {
  console.log("Looking up for user...");
  return next();
});

userSchema.post(/^find/, function () {
  console.log("Finished looking up");
});

userSchema.pre("save", function (next) {
  console.log("About to save user...");
  if (this.isModified("token")) {
    // Set expiration time when new token is set
    this.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  if (this.isModified("hash")) {
    this.passwordChangedAt = new Date(Date.now());
  }
  return next();
});

userSchema.post("save", function () {
  console.log("User saved");
});

// userSchema.post("save", async function (doc) {
// wasNewUser ? console.log("✅ User created") : console.log("✅ User updated");
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
