const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const CustomizedProduct = new Schema(
  {
    code: {
      type: String,
    },
    name: {
      type: String
    },
    status: {
      type: String
    },
    regularPrice: {
      type: Number
    },
    salePrice: {
      type: Number
    },
    onSale: {
      type: Boolean
    },
    dateOnSaleFrom: {
      type: String
    },
    dateOnSaleTo: {
      type: String
    },
    imageUrl: {
      type: String
    },
    imagePsd: {
      type: String,
    },
  },
  { timestamps: true }
);

CustomizedProduct.index({ name: "text" }, { default_language: "english", minLength: 1 });
// const test = mongoose.model("CustomizedProduct", CustomizedProduct);
// test.collection.dropIndexes();
// test.syncIndexes();

CustomizedProduct.plugin(mongoosePaginate);

module.exports = mongoose.model("CustomizedProduct", CustomizedProduct);