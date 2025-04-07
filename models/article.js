const mongoose = require("mongoose");

mongoose.Schema.Types.String.set("trim", true);

const articleSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  author: String,
  description: { type: String, required: [true, "Description is required"] },
  mainImage: String,
  link: String,
  date: { type: Date, default: Date.now },
  show: { type: Boolean, default: true },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
