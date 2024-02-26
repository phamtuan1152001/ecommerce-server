const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    code: {
      type: String
    },
    name: {
      type: String,
    },
    slug: {
      type: String
    },
    description: {
      type: String,
    },
    images: {
      type: Array,
    },
    defaultImageId: {
      type: String
    },
    regularPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    onSale: {
      type: Boolean
    },
    status: {
      type: String
    },
    quantity: {
      type: Number
    },
    dateOnSaleFrom: {
      type: String
    },
    dateOnSaleTo: {
      type: String
    },
    categories: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    }
  },
  { timestamps: true }
);

Product.index({ name: "text" }, { default_language: "english", minLength: 1 });
// const test = mongoose.model("Product", Product);
// test.collection.dropIndexes();
// test.syncIndexes();

Product.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", Product);
