const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: String,
    slug: String,
    description: String,
    imageUrl: String,
    status: String
  },
  { timestamps: true }
)

module.exports = mongoose.model("Category", Category);