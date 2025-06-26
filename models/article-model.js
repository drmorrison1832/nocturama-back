const mongoose = require("mongoose");

mongoose.Schema.Types.String.set("trim", true);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  author: { type: String, trim: true },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  mainImage: { type: String, trim: true },
  link: { type: String, trim: true },
  created: { type: Date, default: () => Date.now() },
  updated: [Date],
  show: { type: Boolean, default: true },
  // tags: [{ type: String, lowercase: true, trim: true }],
  // tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

let wasNewArticle;

// articleSchema.pre(/^find/, function (next) {
//   next();
// });

articleSchema.pre("save", function (next) {
  wasNewArticle = this.isNew;
  if (!this.isNew) {
    this.updated.push(Date.now());
  }
  next();
});

articleSchema.post("save", async function (doc) {
  wasNewArticle
    ? console.log("✅ Article created")
    : console.log("✅ Article updated");
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
