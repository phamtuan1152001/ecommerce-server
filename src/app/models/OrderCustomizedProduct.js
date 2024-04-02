const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const OrderCustomizedProduct = new Schema(
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
        type: String
      },
      districtId: {
        type: String,
      },
      wardId: {
        type: String
      },
      fullAddress: {
        type: String
      }
    },
    customizedProductId: {
      type: String
    },
    customizedProduct: {
      type: Schema.Types.ObjectId,
      ref: "CustomizedProduct"
    }
  },
  { timestamps: true }
)

OrderCustomizedProduct.plugin(mongoosePaginate);

module.exports = mongoose.model("OrderCustomizedProduct", OrderCustomizedProduct);