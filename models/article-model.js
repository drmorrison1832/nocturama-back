const mongoose = require("mongoose");

mongoose.Schema.Types.String.set("trim", true);

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  author: String,
  description: { type: String, required: [true, "Description is required"] },
  coverImage: String,
  link: String,
  created: { type: Date, default: () => Date.now() },
  updated: [Date],
  show: { type: Boolean, default: true },
  tags: [{ type: String, lowercase: true }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // require: [true, "Owner is required"],
    // unique: [true, "Owner is unique"],
  },
});

articleSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.updated.push(Date.now());
  }
  next();
});

articleSchema.post("save", function (doc) {
  if (this.isNew) {
    console.log("✅ Article saved");
  }
  console.log("✅ Article updated");
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
