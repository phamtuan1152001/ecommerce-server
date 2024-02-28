const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const Cart = new Schema(
  {
    userId: {
      type: String,
    },
    items: [{
      productId: {
        type: String
      },
      quantity: {
        type: Number
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      total: {
        type: Number
      },
      subTotal: {
        type: Number
      }
    }],
    totalPrice: {
      type: Number,
    },
    subTotalPrice: {
      type: Number,
    },
    // totalProduct: {
    //   type: Number,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);
