const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const Order = new Schema(
  {
    userId: {
      type: String,
    },
    statusOrder: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    orderAddress: {
      fullName: {
        type: String
      },
      phone: {
        type: String
      },
      email: {
        type: String
      },
      address: {
        type: String
      },
      provinceId: {
        type: Number
      },
      districtId: {
        type: Number,
      },
      wardId: {
        type: Number
      },
      fullAddress: {
        type: String
      }
    },
    cartId: {
      type: String,
    },
    cartDetail: {
      type: Schema.Types.ObjectId,
      ref: "Cart"
    }
    // voucherId: {
    //     type: String,
    // }
  },
  { timestamps: true }
);

Order.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", Order);
