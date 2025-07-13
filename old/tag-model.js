const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name_es: { type: String, required: true, trim: true },
  name_ca: { type: String, required: true, trim: true },
  createdOn: { type: Date, default: () => Date.now() },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
