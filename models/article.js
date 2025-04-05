const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  author: String,
  body: { type: String, required: [true, "Body is required"] },
  mainImage: String,
  link: String,
  date: { type: Date, default: Date.now },
  show: { type: Boolean, default: true },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
