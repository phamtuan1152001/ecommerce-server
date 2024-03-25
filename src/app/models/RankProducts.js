const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const RankProducts = new Schema({
  productId: {
    type: String,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product"
  },
  actionBuy: {
    type: Number
  },
  countBuy: {
    type: Number
  },
  actionReview: {
    type: Number
  },
  countReview: {
    type: Number
  },
  actionRate: {
    type: Number
  },
  countRate: {
    type: Number
  },
  actionIntroduce: {
    type: Number
  },
  countIntroduce: {
    type: Number
  },
  actionSave: {
    type: Number
  },
  countSave: {
    type: Number
  },
  // count: {
  //   type: Number,
  // },
  // userId: {
  //   type: String
  // },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // }
},
  { timestamps: true }
)

RankProducts.index({ name: "text" }, { default_language: "english", minLength: 1 });
// const test = mongoose.model("RankProducts", RankProducts);
// test.collection.dropIndexes();
// test.syncIndexes();

RankProducts.plugin(mongoosePaginate);

module.exports = mongoose.model("RankProducts", RankProducts);